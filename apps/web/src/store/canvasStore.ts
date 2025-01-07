import { useRef } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import throttle from 'lodash/throttle';

interface CanvasState {
  // Basic canvas properties
  color: string;
  lineWidth: number;
  tool: "pencil" | "eraser" | "touch" | "hand" | "text" | "image";
  eraserWidth: number;
  image: string | undefined;

  // Socket and drawing state
  socket: Socket | null;
  isDrawing: boolean;
  drawMode: boolean; // Add this to track eraser mode
  paths: any[];

  // Actions
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setTool: (tool: CanvasState["tool"]) => void;
  setEraserWidth: (width: number) => void;
  setImage: (image: string | undefined) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setPaths: (paths: any[]) => void;

  // Socket actions
  initializeSocket: (roomId: string, canvasRef: ReactSketchCanvasRef) => void;
  disconnectSocket: () => void;
  emitDrawing: (
    roomId: string,
    point: { x: number; y: number },
    prevPoint: { x: number; y: number }
  ) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  color: "white",
  lineWidth: 4,
  tool: "pencil",
  eraserWidth: 10,
  image: undefined,
  socket: null,
  isDrawing: false,
  drawMode: false, // Add this
  paths: [],

  // Basic actions
  setColor: (color) => set({ color }),
  setLineWidth: (lineWidth) => set({ lineWidth }),
  setTool: (tool) => set({ tool }),
  setEraserWidth: (eraserWidth) => set({ eraserWidth }),
  setImage: (image) => set({ image }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),
  setPaths: (paths) => set({ paths }),

  // Socket actions
  initializeSocket: (roomId: string, canvasRef: ReactSketchCanvasRef) => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 20000,
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to server");
      socket.emit("join-room", roomId);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    // Handle real-time drawing updates
    socket.on("draw-path", async (pathData) => {
      if (canvasRef) {
        const currentPaths = await canvasRef.exportPaths();
        currentPaths.push(pathData);
        canvasRef.loadPaths(currentPaths);
      }
    });

    // Handle canvas state sync
    socket.on("request-canvas-state", async () => {
      if (canvasRef) {
        const paths = await canvasRef.exportPaths();
        socket.emit("canvas-state", { roomId, paths });
      }
    });

    socket.on("receive-canvas-state", (paths) => {
      if (canvasRef && paths) {
        canvasRef.clearCanvas();
        canvasRef.loadPaths(paths);
      }
    });

    socket.on("clear-canvas", () => {
      if (canvasRef) {
        canvasRef.clearCanvas();
      }
    });

    // Clean up paths periodically to prevent memory buildup
    const cleanupInterval = setInterval(async () => {
      if (canvasRef) {
        try {
          const paths = await canvasRef.exportPaths();
          if (paths.length > 2000) { // Adjust this threshold as needed
            const recentPaths = paths.slice(-2000);
            await canvasRef.loadPaths(recentPaths);
          }
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
    }, 60000);

    set({ socket });

    return () => {
      clearInterval(cleanupInterval);
      socket.off("draw-path");
      socket.off("request-canvas-state");
      socket.off("receive-canvas-state");
      socket.off("clear-canvas");
      socket.disconnect();
    };
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  // Throttle drawing emissions
  emitDrawing: throttle((roomId: string, currentPoint: any, prevPoint: any) => {
    const { socket, color, lineWidth, tool, eraserWidth } = get();
    if (!socket || !currentPoint || !prevPoint) return;

    const isEraser = tool === "eraser";
    const pathData = {
      drawMode: isEraser,
      strokeColor: isEraser ? "#ffffff" : color,
      strokeWidth: isEraser ? eraserWidth : lineWidth,
      paths: [prevPoint, currentPoint],
      op: "draw",
      roomId,
    };

    socket.volatile.emit("draw-path", { roomId, pathData });
  }, 16), // Throttle to ~60fps
}));

export const canvasComponent = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  return canvasRef;
};

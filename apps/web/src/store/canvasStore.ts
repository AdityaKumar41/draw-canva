import { useRef } from "react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { create } from "zustand";
import { io, Socket } from "socket.io-client";

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

  // Actions
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setTool: (tool: CanvasState["tool"]) => void;
  setEraserWidth: (width: number) => void;
  setImage: (image: string | undefined) => void;
  setIsDrawing: (isDrawing: boolean) => void;

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

  // Basic actions
  setColor: (color) => set({ color }),
  setLineWidth: (lineWidth) => set({ lineWidth }),
  setTool: (tool) => set({ tool }),
  setEraserWidth: (eraserWidth) => set({ eraserWidth }),
  setImage: (image) => set({ image }),
  setIsDrawing: (isDrawing) => set({ isDrawing }),

  // Socket actions
  initializeSocket: (roomId: string, canvasRef: ReactSketchCanvasRef) => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      reconnectionDelay: 1000,
      forceNew: true,
    });

    socket.on("connect", () => {
      socket.emit("join-room", roomId);
    });

    // Improved canvas state sync
    socket.on("get-canvas-state", async () => {
      try {
        const paths = await canvasRef.exportPaths();
        if (paths) {
          socket.emit("send-canvas-state", { state: paths, roomId });
        }
      } catch (error) {
        console.error("Error exporting canvas state:", error);
      }
    });

    socket.on("receive-canvas-state", (state) => {
      try {
        if (state) {
          canvasRef.loadPaths(state);
        }
      } catch (error) {
        console.error("Error loading canvas state:", error);
      }
    });

    socket.on("draw-line", (drawData) => {
      try {
        const { color, currentPoint, prevPoint, newlineWidth, isEraser } =
          drawData;
        if (!canvasRef || !currentPoint || !prevPoint) return;

        const path = [
          {
            drawMode: isEraser,
            strokeColor: isEraser ? "#ffffff" : color,
            strokeWidth: isEraser ? newlineWidth * 2 : newlineWidth, // Adjust eraser width for better visibility
            paths: [prevPoint, currentPoint],
            op: "draw",
          },
        ];

        requestAnimationFrame(() => {
          if (canvasRef.eraseMode) {
            canvasRef.eraseMode(isEraser);
          }
          canvasRef.loadPaths(path);
        });
      } catch (error) {
        console.error("Error syncing drawing:", error);
      }
    });

    socket.on("clearing-canvas", () => {
      canvasRef.clearCanvas();
    });

    set({ socket });

    // Cleanup function
    return () => {
      socket.off("get-canvas-state");
      socket.off("receive-canvas-state");
      socket.off("draw-line");
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

  // More efficient drawing emission
  emitDrawing: (roomId: string, currentPoint, prevPoint) => {
    const { socket, color, lineWidth, tool, eraserWidth } = get();
    if (!socket || !currentPoint || !prevPoint) return;

    const isEraser = tool === "eraser";
    const drawData = {
      color: color,
      currentPoint,
      prevPoint,
      newlineWidth: isEraser ? eraserWidth : lineWidth,
      isEraser,
      timestamp: Date.now(),
    };

    socket.emit("start-drawing", {
      roomId,
      roomDrawLine: drawData,
    });
  },
}));

export const canvasComponent = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  return canvasRef;
};

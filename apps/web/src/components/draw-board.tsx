import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
  type CanvasPath,
} from "react-sketch-canvas";
import { useCanvasStore } from "../store/canvasStore";
import { useRef, useEffect, useCallback } from "react";

const DrawBoard = ({ roomId }: { roomId?: string }) => {
  const {
    color,
    lineWidth,
    tool,
    eraserWidth,
    image,
    initializeSocket,
    disconnectSocket,
    emitDrawing,
  } = useCanvasStore();

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  // const prevPoint = useRef<{ x: number; y: number } | null>(null);
  // const isDrawingRef = useRef(false);

  useEffect(() => {
    if (tool === "eraser") {
      canvasRef.current?.eraseMode(true);
    } else {
      canvasRef.current?.eraseMode(false);
    }
  }, [tool]);

  useEffect(() => {
    if (roomId && canvasRef.current) {
      initializeSocket(roomId, canvasRef.current);
      const cleanup = () => {};
      return () => {
        cleanup();
        disconnectSocket();
      };
    }
  }, [roomId, canvasRef]);

  const handleStroke = useCallback(
    async (paths: CanvasPath[]) => {
      if (!roomId || !paths.length) return;

      const currentPath = paths[paths.length - 1];
      if (!currentPath?.paths?.length) return;

      // Only send every other point to reduce network traffic
      for (let i = 1; i < currentPath.paths.length; i += 2) {
        const prevPoint = currentPath.paths[i - 1];
        const currentPoint = currentPath.paths[i];
        emitDrawing(roomId, currentPoint, prevPoint);
      }

      // Limit stored paths
      if (paths.length > 1000) {
        const recentPaths = paths.slice(-1000);
        if (canvasRef.current) {
          canvasRef.current.loadPaths(recentPaths);
        }
      }
    },
    [roomId, emitDrawing]
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.resetCanvas();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update the way we handle drawing mode
  const isEraser = tool === "eraser";

  return (
    <div className="relative w-full h-full">
      <ReactSketchCanvas
        ref={canvasRef}
        canvasColor="transparent"
        strokeColor={isEraser ? "#ffffff" : color}
        strokeWidth={isEraser ? eraserWidth : lineWidth}
        eraserWidth={eraserWidth}
        backgroundImage={image}
        style={{ border: "none" }}
        preserveBackgroundImageAspectRatio="xMidYMid"
        className="cursor-pointer"
        onChange={handleStroke}
        allowOnlyPointerType="all"
        width="100%"
        height="100%"
        exportWithBackgroundImage={true}
      />
    </div>
  );
};

export default DrawBoard;

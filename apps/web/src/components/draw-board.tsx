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
  const prevPoint = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);

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
      return () => disconnectSocket();
    }
  }, [roomId]);

  const handleStroke = useCallback(
    (paths: CanvasPath[]) => {
      if (!roomId || !paths.length) return;

      const currentPath = paths[paths.length - 1];
      if (!currentPath?.paths?.length) return;

      // Send all points in the current path for smoother drawing
      currentPath.paths.forEach((point, index) => {
        if (index === 0) {
          prevPoint.current = point;
          return;
        }

        emitDrawing(roomId, point, prevPoint.current!);
        prevPoint.current = point;
      });
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

import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import DockMenu from "./dock";
import Header from "./header";
import { useCanvasStore } from "../store/canvasStore";
import { useRef, useEffect } from "react";

const DrawBoard = ({ room }: { room?: string }) => {
  const { color, lineWidth, tool } = useCanvasStore();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  useEffect(() => {
    if (tool === "eraser") {
      canvasRef.current?.eraseMode(true);
    } else {
      canvasRef.current?.eraseMode(false);
    }
  }, [tool]);

  return (
    <div className="w-full h-screen relative dark:bg-black bg-white ">
      <Header />
      <ReactSketchCanvas
        ref={canvasRef}
        canvasColor="black"
        strokeColor={color}
        strokeWidth={lineWidth}
        style={{ border: "none" }}
        // allowOnlyPointerType="touch"
      />
      <DockMenu />
    </div>
  );
};

export default DrawBoard;

import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import DockMenu from "./dock";
import Header from "./header";
import { useCanvasStore } from "../store/canvasStore";

const DrawBoard = ({ room }: { room?: string }) => {
  const { color, lineWidth } = useCanvasStore();
  return (
    <div className="w-full h-screen relative dark:bg-black bg-white ">
      <Header />
      <ReactSketchCanvas
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

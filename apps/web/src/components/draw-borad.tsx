import { ReactSketchCanvas } from "react-sketch-canvas";
import DockMenu from "./dock";

const DrawBoard = ({ room }: { room?: string }) => {
  return (
    <div className="w-full h-screen relative dark:bg-black bg-white ">
      <ReactSketchCanvas
        canvasColor="black"
        strokeColor="white"
        style={{ border: "none" }}
        // allowOnlyPointerType="touch"
      />
      <DockMenu />
    </div>
  );
};

export default DrawBoard;

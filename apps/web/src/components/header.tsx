import React from "react";
import { SideMenu } from "./side-menu";
import { SessionDialog } from "./session";
import { Camera } from "lucide-react";
import { ReactSketchCanvasRef } from "react-sketch-canvas";

const Header = ({
  canvasRef,
}: {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}) => {
  const handleExport = async () => {
    if (canvasRef.current) {
      const dataURL = await canvasRef.current.exportImage("jpeg");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "whiteboard.png";
      link.click();
    }
  };

  return (
    <div className="flex justify-between items-center absolute right-4 top-4 z-10">
      {/* <div>
        <h1 className="text-2xl font-bold text-white">Whiteboard</h1>
      </div> */}
      <div className="flex space-x-4 items-center z-10">
        <button
          className="bg-white border border-gray-700 p-2 rounded-md dark:bg-[#212121] dark:border-gray-700"
          onClick={handleExport}
        >
          <Camera color="white" />
        </button>
        <SessionDialog />
        <SideMenu />
      </div>
    </div>
  );
};

export default Header;

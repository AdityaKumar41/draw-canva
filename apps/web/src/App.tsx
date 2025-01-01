import { ReactSketchCanvasRef } from "react-sketch-canvas";
import DockMenu from "./components/dock";
import DrawBoard from "./components/draw-board";
import Header from "./components/header";
import { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoomSession from "./components/room";

const App = () => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  return (
    <BrowserRouter>
      <div className="dark">
        <div className="w-full h-screen relative dark:bg-black bg-white ">
          <Header canvasRef={canvasRef} />
          <Routes>
            <Route path="/" element={<DrawBoard />} />
            <Route path="/room/:roomId" element={<RoomSession />} />
          </Routes>
          <DockMenu canvasRef={canvasRef} />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;

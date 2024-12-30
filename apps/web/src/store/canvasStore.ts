import { create } from "zustand";

interface CanvasState {
  color: string;
  lineWidth: number;
  tool: "pencil" | "eraser" | "pointer" | "hand" | "text" | "image";
  setColor: (color: string) => void;
  setLineWidth: (width: number) => void;
  setTool: (tool: CanvasState["tool"]) => void;
  eraseLine: (event: MouseEvent) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  color: "white",
  lineWidth: 4,
  tool: "pencil",
  setColor: (color) => set({ color }),
  setLineWidth: (lineWidth) => set({ lineWidth }),
  setTool: (tool) => set({ tool }),
  eraseLine: (event) => {
    // Implement the logic to erase lines based on the event
    const { clientX, clientY } = event;
    console.log(`Erasing line at coordinates: (${clientX}, ${clientY})`);
    // Logic to find and erase the line at (clientX, clientY)
  },
}));

import { SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover-ui";
import { TwitterPicker } from "react-color";
import { useCanvasStore } from "../store/canvasStore";

export function SideMenu() {
  const { color, lineWidth, setColor, setLineWidth } = useCanvasStore();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="bg-white border border-gray-700 p-2 rounded-md dark:bg-[#212121] dark:border-gray-700 ">
          <SlidersHorizontal color="white" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4 dark:text-white dark:bg-black">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Canva Setting</h4>
            <p className="text-sm text-muted-foreground">
              Manage your canvas settings here.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Line Width</p>
              <p>{lineWidth}</p>
            </div>
            <div className="grid grid-cols-3 items-center gap-4 ">
              <input
                type="range"
                className="w-52 dark:bg-gray-700 dark:accent-white"
                min={0}
                max={20}
                value={lineWidth}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
              />
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">Color</p>
              <TwitterPicker
                color={color}
                onChangeComplete={(color) => setColor(color.hex)}
                className="bg-black"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

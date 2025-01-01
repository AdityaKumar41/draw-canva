import { FloatingDock } from "./ui/floawting-dock";
import {
  IconChevronUp,
  IconEraser,
  IconHandGrab,
  IconLetterT,
  IconPencil,
  IconPhoto,
  IconPointer,
} from "@tabler/icons-react";
import { useCanvasStore } from "../store/canvasStore";
import { ReactSketchCanvasRef } from "react-sketch-canvas";
import { useRef } from "react";

function DockMenu({
  canvasRef,
}: {
  canvasRef: React.RefObject<ReactSketchCanvasRef>;
}) {
  const { tool, setTool, setImage } = useCanvasStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        // change the size of the image here
        setImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const links = [
    {
      title: "Pointer",
      icon: (
        <IconPointer
          className={`h-full w-full ${
            tool === "touch"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => setTool("touch"),
    },
    {
      title: "Hand",
      icon: (
        <IconHandGrab
          className={`h-full w-full ${
            tool === "hand"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => setTool("hand"),
    },
    {
      title: "Pencil",
      icon: (
        <IconPencil
          className={`h-full w-full ${
            tool === "pencil"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => {
        setTool("pencil");
        canvasRef.current?.eraseMode(false);
      },
    },
    {
      title: "Eraser",
      icon: (
        <IconEraser
          className={`h-full w-full ${
            tool === "eraser"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => {
        setTool("eraser");
        canvasRef.current?.eraseMode(true);
      },
    },
    {
      title: "Text",
      icon: (
        <IconLetterT
          className={`h-full w-full ${
            tool === "text"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => setTool("text"),
    },
    {
      title: "Image",
      icon: (
        <IconPhoto
          className={`h-full w-full ${
            tool === "image"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => {
        fileInputRef.current?.click();
      },
    },
    {
      title: "More",
      icon: (
        <IconChevronUp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
      onClick: () => {},
    },
  ];

  return (
    <div className="flex items-center justify-center  w-full absolute bottom-5">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}

export default DockMenu;

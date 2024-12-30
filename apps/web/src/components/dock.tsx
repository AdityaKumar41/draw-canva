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

function DockMenu() {
  const { tool, setTool } = useCanvasStore();
  const links = [
    {
      title: "Pointer",
      icon: (
        <IconPointer
          className={`h-full w-full ${
            tool === "pointer"
              ? "text-blue-500"
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
      ),
      href: "#",
      onClick: () => setTool("pointer"),
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
      onClick: () => setTool("pencil"),
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
      onClick: () => setTool("eraser"),
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
      onClick: () => setTool("image"),
    },
    {
      title: "More",
      icon: (
        <IconChevronUp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="flex items-center justify-center  w-full absolute bottom-5">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}

export default DockMenu;

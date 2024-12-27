import { FloatingDock } from "./ui/floawting-dock";
import {
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandX,
  IconChevronUp,
  IconCursorText,
  IconEraser,
  IconExchange,
  IconHandGrab,
  IconHome,
  IconLetterT,
  IconNewSection,
  IconPencil,
  IconPhoto,
  IconPointer,
  IconTerminal2,
} from "@tabler/icons-react";

function DockMenu() {
  const links = [
    {
      title: "Pointer",
      icon: (
        <IconPointer className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Hand",
      icon: (
        <IconHandGrab className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Pencil",
      icon: (
        <IconPencil className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Eraser",
      icon: (
        <IconEraser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Text",
      icon: (
        <IconLetterT className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Image",
      icon: (
        <IconPhoto className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
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

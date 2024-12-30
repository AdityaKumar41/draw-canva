import { Copy, Radio } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog-ui";

export function SessionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-[#212121] border border-[#e5e7eb] p-2 rounded-md  dark:bg-[#212121] dark:border-gray-700">
          <Radio color="white" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:text-white dark:bg-black">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
              className="w-full bg-[#212121] border border-[#e5e7eb] p-2 rounded-md dark:border-[#212121] dark:bg-black text-white"
            />
          </div>
          <button type="submit" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy />
          </button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <button
              type="button"
              className="bg-[#212121] px-4 py-2 rounded-md text-white text-center"
            >
              Close
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

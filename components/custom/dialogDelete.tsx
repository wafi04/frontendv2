import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DialogDelete({
  name,
  open,
  onClose,
  title,
  desc,
  onAction,
}: {
  name?: string;
  open: boolean;
  onClose: () => void;
  title: string;
  desc: string;
  onAction: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            {desc}
            {name && (
              <span className="block mt-2 font-semibold text-gray-900">
                {name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onAction}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
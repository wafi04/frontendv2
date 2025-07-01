import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import FormSubCategory from "../form";
import { SubCategory } from "@/types/subCategory";

interface DialogSubCategoryProps {
  open: boolean;
  setOpen: () => void;
  data?: SubCategory;
}

export default function DialogSubCategory({
  open,
  setOpen,
  data,
}: DialogSubCategoryProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>Create Sub Categories</DialogTitle>
        <DialogDescription>Create Sub Categories</DialogDescription>
        <FormSubCategory initialData={data} />
      </DialogContent>
    </Dialog>
  );
}

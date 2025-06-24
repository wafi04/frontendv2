import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormCrudCategory } from "../form";
import { CategoryData } from "@/types/category";

interface DialogCategoryProps {
  open: boolean;
  onClose: () => void;
  category? : CategoryData
}

export function DialogCategory(props: DialogCategoryProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogTitle>Buat Kategori Baru</DialogTitle>
        <DialogDescription>
          Lengkapi informasi kategori dalam beberapa langkah mudah
        </DialogDescription>
        <FormCrudCategory category={props.category} />
      </DialogContent>
    </Dialog>
  );
}

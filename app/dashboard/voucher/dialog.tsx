import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { VoucherForm } from "./form";
export function DialogCreateVOucher({
    open,
    setOpen
}: {
    open: boolean
    setOpen: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Voucher
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Voucher</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new voucher code.
                    </DialogDescription>
                </DialogHeader>
                <VoucherForm onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
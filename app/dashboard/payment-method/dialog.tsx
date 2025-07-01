import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormPaymentMethod } from "./form";
import { PaymentMethod } from "@/types/paymentMethod";

export function DialogPaymentMethod({
    open,
    onClose,
    initialData
}: {
    open: boolean,
    onClose: () => void
    initialData?: PaymentMethod
}) {
    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        crud
                    </DialogTitle>
                    <DialogDescription>
                        Add, update, or remove payment methods available to users.
                    </DialogDescription>
                </DialogHeader>
                <FormPaymentMethod data={initialData}
                />
            </DialogContent>
        </Dialog>
    )
}
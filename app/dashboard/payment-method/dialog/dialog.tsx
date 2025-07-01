import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CategoryData } from "@/types/category";
import { PaymentMethodData } from "@/types/paymentMethod";
import { FormPaymentMethod } from "../form";

interface DialogPayemntMethodDataProps {
    open: boolean;
    onClose: () => void;
    initialData?: PaymentMethodData
}

export function DialogPayemntMethod(props: DialogPayemntMethodDataProps) {
    return (
        <Dialog open={props.open} onOpenChange={props.onClose}>
            <DialogContent className="w-full max-w-[calc(100%-100px)]">
                <DialogTitle>Buat Metode PembayaranBaru</DialogTitle>
                <DialogDescription>
                    Lengkapi informasi Metode Pembayaran  dalam beberapa langkah mudah
                </DialogDescription>
                <FormPaymentMethod initialData={props.initialData} />
            </DialogContent>
        </Dialog>
    );
}

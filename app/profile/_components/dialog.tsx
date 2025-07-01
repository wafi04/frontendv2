import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { FormatPrice } from "@/utils/format";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface DialogDepositAndMembershipProps {
    type: "MEMBERSHIP" | "DEPOSIT";
    amount: number;
    open: boolean;
    tax: number;
    totalAmount: number;
    onClose: () => void;
    payment: {
        code: string;
        name: string;
    };
}

export function DialogDepositAndMembership({
    type,
    amount,
    totalAmount,
    tax,
    payment,
    open,
    onClose,
}: DialogDepositAndMembershipProps) {
    const [loading, setLoading] = useState<boolean>(false);
    async function handlePost() {
        setLoading(true);
        try {
            const payload = {
                amount,
                tax,
                totalAmount,
                code: payment.code,
                type,
            };
            const req = await api.post<any>('/deposit', payload);
            const data = await req.data;
            console.log(data)
            if (data.success) {
                toast.success("create deposit successfully");
            }
            return req.data;
        } catch (error) {
            toast.error("failed to create deposit");
        } finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {type === "MEMBERSHIP" ? "Membership Payment" : "Deposit Payment"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Metode Pembayaran</p>
                        <p className="font-medium">{payment.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Harga : </p>
                        <p className="font-medium">{FormatPrice(amount)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Fee : </p>
                        <p className="font-medium">{FormatPrice(tax)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total : </p>
                        <p className="font-medium">{FormatPrice(totalAmount)}</p>
                    </div>
                </div>
                <DialogFooter className="flex flex-row justify-between items-center gap-3 ">
                    <Button onClick={onClose} className="w-1/2">
                        Cancel
                    </Button>
                    <Button onClick={handlePost} disabled={loading} className="w-1/2">
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

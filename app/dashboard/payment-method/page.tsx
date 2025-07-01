"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetPaymentMethods } from "./server";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogPaymentMethod } from "./dialog";
import { PaymentMethodsTable } from "./table";
import { PaymentMethod } from "@/types/paymentMethod";

export default function PaymentMethodPage() {
    const [open, setOpen] = useState(false)
    const { data, isLoading, error } = useGetPaymentMethods()

    if (isLoading) {
        return null
    }

    console.log(data)
    return (
        <>
            <HeaderDashboard
                title="Manage Payment Methods"
                desc="Add, update, or remove payment options available to users."
            >
                <Button onClick={() => setOpen(true)}>Add</Button>
            </HeaderDashboard>

            {open && <DialogPaymentMethod onClose={() => setOpen(!open)} open={open} />}

            <div className="p-4">
                <PaymentMethodsTable data={data ?? [] as PaymentMethod[]} />
            </div>
        </>
    );
}
"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetPaymentMethods } from "./server";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DialogPayemntMethod } from "./dialog/dialog";

export default function Page() {
    const { data, error, isLoading } = useGetPaymentMethods()
    const [open, setOpen] = useState(false)
    return (
        <>
            <HeaderDashboard title="Payement Method" desc="Manage all payment method" >
                <Button onClick={() => setOpen(true)}>
                    Create
                </Button>
            </HeaderDashboard>
            {
                open && (
                    <DialogPayemntMethod onClose={() => setOpen(!open)} open={open} />
                )
            }

        </>
    )
}
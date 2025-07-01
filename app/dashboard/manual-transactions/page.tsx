"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetManualTransactions } from "./server";

export default function ManualTransactions() {
    const { data, isLoading, error } = useGetManualTransactions();
    console.log(data)
    return (
        <>

            <HeaderDashboard title="Manual Transactions" desc="Manage Manual Transactions" />
        </>
    )
}
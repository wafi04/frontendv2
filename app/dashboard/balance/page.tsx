"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetBalance } from "./server";
import { BalanceComponent } from "./balanceComponent";

export default function Page() {
    const { data } = useGetBalance({
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toDateString().split("T")[0]
    })

    const balanceData = data?.data ?? []
    return (
        <>
            <HeaderDashboard title="Manage All Balance" desc="Manage All Balance Transaction" />
            <BalanceComponent data={balanceData} />
        </>
    )
}
"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetAllBalance, useGetHistoryBalance } from "./server";
import { BalanceComponent } from "./moneyResources";
import { useState } from "react";

export default function Page(){
    const {data,error,isLoading}  = useGetAllBalance() 
    const [selectBalance,setSelectBalance] = useState<number>(4)
    const {data : HistoryBalance, isLoading : LoadingHistories, error : ErrorHistories} = useGetHistoryBalance(selectBalance) 
    console.log(HistoryBalance)
    return (
        <>
            <HeaderDashboard title="Manage All Balance" desc="Manage All Balance"/>
            <BalanceComponent data={data?.data ?? []}/>
        </>
    )
}
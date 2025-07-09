"use client"
import { HeaderDashboard } from "@/components/layouts/headerDashboard";
import { useGetAllBalance } from "./server";

export default function Page(){
    const {data,error,isLoading}  = useGetAllBalance()
    console.log(data)
    
    return (
        <>
            <HeaderDashboard title="Manage All Balance" desc="Manage All Balance"/>
        </>
    )
}
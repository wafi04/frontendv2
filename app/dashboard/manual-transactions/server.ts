"use client"
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetManualTransactions() {
    const {data,isLoading,error} = useQuery({
        queryKey: ["manual-transactions"],
        queryFn: async () => {
            const response = await api.get('/transactions/retransactions');
            return response.data
        },
        gcTime: 5 * 60 * 1000,
        staleTime : 5 * 60 * 1000,
    });
    return {
        data,
        isLoading,
        error
    }
}
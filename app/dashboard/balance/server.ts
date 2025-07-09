import { api } from "@/lib/axios";
import { PlatformBalance } from "@/types/balance";
import { API_RESPONSE } from "@/types/response";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
export type CreateBalance = {
    platformName: string
    accountName: string
    accountNumber: string
    balance: number
}

export function useCreateBalance() {
    return useMutation({
        mutationFn: async ({data} : {data : CreateBalance}) => {
            const req = await api.post("/balance", data)
            return req.data
        },
        onSuccess: (result : any) => {
            toast.success(`create balace ${result.data.data.name ?? "balance"}`)
        },
        onError: () => {
            toast.error("Failed to create balance")
        }
    })
}

export function useGetBalance(filter : {startDate : string, endDate : string}) {
    return useQuery({
        queryKey : ["balance-all"],
        queryFn: async () => {
            const req = await api.get<API_RESPONSE<PlatformBalance[]>>(`/balance?startDate=${filter.startDate}&endDate=${filter.endDate}`)
            return req.data
        },
        staleTime: 5 * 60 * 1000,
       gcTime : 5 * 60 * 1000
    })
}
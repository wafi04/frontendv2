"use client"
import { useDebounce } from "@/hooks/useDebounced";
import { api } from "@/lib/axios";
import { PaginationMeta } from "@/types/category";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
export interface ManualTransactionsData {
    created_at: string; 
    created_by: string;
    id: number;
    manual_transaction_id: string;
    nickname: string | null;
    order_id: string;
    price: number;
    product_name: string;
    profit: number;
    profit_amount: number;
    reason: string;
    serial_number: string | null;
    service_name: string;
    status: "PROCESS" | "PENDING" | "FAILED" | "SUCCESS"; // assuming other possible values
    transaction_status: "SUCCESS" | "FAILED" | "PROCESS"; // extend if needed
    updated_at: string; 
    user_id: string;
    whatsapp: string;
    zone: string;
}

export interface PaginationResponse {
    meta : PaginationMeta
    data : ManualTransactionsData[]
}


export interface ApiPaginationResponse {
 message : string
 success : boolean
 data : PaginationResponse   
}


export type FilterTable = {
    createdBy?: string
    page: string
    limit: string
    search?: string
    status?: string
}
export function useGetManualTransactions(filters : FilterTable) {

    const debouncedSearch = useDebounce(filters.search, 500) 
        
        const debouncedFilters = useMemo(() => ({
            ...filters,
            search: debouncedSearch
        }), [filters, debouncedSearch])

    const {data,isLoading,error} = useQuery({
        queryKey: ["manual-transactions",filters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (debouncedFilters.search) params.append('search', debouncedFilters.search)
            if (debouncedFilters.createdBy) params.append('createdBy', debouncedFilters.createdBy)
            if (debouncedFilters.status) params.append('status', debouncedFilters.status)
                        
            const response = await api.get<ApiPaginationResponse>(`/transactions/retransactions?${params.toString()}`);
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
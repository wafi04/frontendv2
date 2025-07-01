import { api } from "@/lib/axios";
import { API_RESPONSE, PaginationParams } from "@/types/response";
import {  RecentTransactionsPagination } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";

export interface TransactionFilters extends PaginationParams{
  search?: string;
  startDate?: string
  endDate?  : string;
  status?: string;
  transactionType?: string;
}


export function useGetTransactions({ filters }: { filters?: TransactionFilters }) {
    // Create query key that includes all filter parameters
    const queryKey = ["recent-transactions", filters];
    
    const { data, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            // Build query parameters
            const params = new URLSearchParams();
            
            if (filters?.limit) params.append("limit", filters.limit);
            if (filters?.page) params.append("page", filters.page);
            if (filters?.startDate) params.append("startDate", filters.startDate);
            if (filters?.endDate) params.append("endDate", filters.endDate);
            if (filters?.search) params.append("search", filters.search);
            if (filters?.status) params.append("status", filters.status);
            if (filters?.transactionType) params.append("transactionType", filters.transactionType);
            
            const queryString = params.toString();
            const url = queryString ? `/transactions?${queryString}` : "/transactions";
            
            const req = await api.get<API_RESPONSE<RecentTransactionsPagination>>(url);
            return req.data;
        },
        gcTime: 5 * 60 * 1000,
        staleTime: 2 * 60 * 1000, // Reduced stale time for more frequent updates
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // Only fetch if we have valid parameters
        enabled: true,
    });

    return {
        data,
        isLoading,
        error
    };
}
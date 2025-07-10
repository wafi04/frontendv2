import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { Transaction } from "@/types/transactions";
import { useQuery } from "@tanstack/react-query";

interface FilterProps {
    startDate: string,
    endDate: string,
    status: string,
    search?: string
}

export function useGetAllTransactions(filters: FilterProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['print-transactions', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.startDate) {
                params.append('startDate', filters.startDate);
            }
            if (filters?.endDate) {
                params.append('endDate', filters.endDate);
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.search) {
                params.append('search', filters.search);
            }
            
            const queryString = params.toString();
            const url = queryString ? `/print/transactions?${queryString}` : '/print/transactions';
            
            const res = await api.get<API_RESPONSE<Transaction[]>>(url);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        enabled: !!filters.startDate && !!filters.endDate
    });

    return {
        data: data,
        isLoading,
        error
    };
}

export function useGetAllDeposits(filters: FilterProps) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['print-deposit', filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters?.startDate) {
                params.append('startDate', filters.startDate);
            }
            if (filters?.endDate) {
                params.append('endDate', filters.endDate);
            }
            if (filters?.status) {
                params.append('status', filters.status);
            }
            if (filters?.search) {
                params.append('search', filters.search);
            }
            
            const queryString = params.toString();
            const url = queryString ? `/print/deposit?${queryString}` : '/print/deposit';
            
            const res = await api.get<API_RESPONSE<Transaction[]>>(url);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        enabled: !!filters.startDate && !!filters.endDate
    });

    return {
        data: data,
        isLoading,
        error
    };
}



export function useGetAllMembers() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['print-member'],
        queryFn: async () => {
            const url = `/print/members`;
            const res = await api.get<API_RESPONSE<Transaction[]>>(url);
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });

    return {
        data: data,
        isLoading,
        error
    };
}
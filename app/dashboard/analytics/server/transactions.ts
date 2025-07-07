import { useDebounce } from "@/hooks/useDebounced"
import { api } from "@/lib/axios"
import { API_RESPONSE } from "@/types/response"
import { ApiMostaUserActiveResponse, ApiMostResponse, TransactionAnalytics } from "@/types/transactions"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

export interface FilterType {
    startDate: string
    endDate: string
    status?: string
    search?: string
    type?: string
}

export function useGetAnalyticsTransactionByType({ filter }: { filter: FilterType }) {
    const debouncedSearch = useDebounce(filter.search, 500) 
    
    const debouncedFilters = useMemo(() => ({
        ...filter,
        search: debouncedSearch
    }), [filter, debouncedSearch])

    const { data, isLoading, error } = useQuery({
        // PERBAIKAN: Gunakan debouncedFilters sebagai queryKey agar sinkron
        queryKey: ["transaction-stats", debouncedFilters],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (debouncedFilters.search) params.append('username', debouncedFilters.search)
            if (debouncedFilters.startDate) params.append('startDate', debouncedFilters.startDate)
            if (debouncedFilters.type) params.append('type', debouncedFilters.type)
            if (debouncedFilters.endDate) params.append('endDate', debouncedFilters.endDate)
            if (debouncedFilters.status) params.append('status', debouncedFilters.status)
                        
            const data = await api.get<API_RESPONSE<TransactionAnalytics>>(`/transactions/analytics/type/data?${params.toString()}`)
            return data.data
        },
        enabled: !!(debouncedFilters.startDate && debouncedFilters.endDate)
    })

    return {
        data,
        isLoading,
        error
    }
}


export function useGetMostProductSell({ filter }: { filter: FilterType }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['most-product-sell',filter],
        queryFn: async () => {
             const params = new URLSearchParams()
                if (filter.startDate) params.append('startDate', filter.startDate)
                if (filter.type) params.append('type', filter.type)
                if (filter.endDate) params.append('endDate', filter.endDate)
                if (filter.status) params.append('status', filter.status)
            const data = await api.get<ApiMostResponse>(`/transactions/analytics/top-products?${params.toString()}`)
            return data.data
        },
    })
    return {
        data,
        isLoading,
        error
    }
}


export function useGetMostUserActive({ filter }: { filter: FilterType }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['most-product-sell',filter],
        queryFn: async () => {
             const params = new URLSearchParams()
                if (filter.startDate) params.append('startDate', filter.startDate)
                if (filter.type) params.append('type', filter.type)
                if (filter.endDate) params.append('endDate', filter.endDate)
                if (filter.status) params.append('status', filter.status)
            const data = await api.get<ApiMostaUserActiveResponse>(`/transactions/analytics/active-users?${params.toString()}`)
            return data.data
        },
    })
    return {
        data,
        isLoading,
        error
    }
}
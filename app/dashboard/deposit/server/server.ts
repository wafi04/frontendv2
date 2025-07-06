import { useDebounce } from "@/hooks/useDebounced";
import { api } from "@/lib/axios";
import { DepositWithPagination } from "@/types/deposit";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
interface Filter {
    limit: string
    page: string
    status: string
    search : string
}

export function useGetAllDepositUser(
    {filters} : {filters : Filter}
){

    const debouncedSearch = useDebounce(filters.search, 500) 
    

    const debouncedFilters = useMemo(() => ({
        ...filters,
        search: debouncedSearch
    }), [filters.limit, filters.page, debouncedSearch])

    const {data, isLoading, error} = useQuery({
        queryKey : ["users-all", debouncedFilters],
        queryFn : async()  => {
            const params = new URLSearchParams()
            
            if (debouncedFilters.limit) params.append('limit', debouncedFilters.limit)
            if (debouncedFilters.page) params.append('page', debouncedFilters.page)
            if (debouncedFilters.search) params.append('search', debouncedFilters.search)
            if (debouncedFilters.status) params.append('status', debouncedFilters.status)
            
            const req = await api.get<API_RESPONSE<DepositWithPagination>>(`/deposit/all?${params.toString()}`)
            return req.data
        },
        staleTime : 10 * 60 * 1000,
        gcTime : 10 * 60 * 1000,
        // Jangan fetch kalau search kosong dan baru pertama kali
        enabled: debouncedSearch.length >= 3 || debouncedSearch.length === 0
    })

    return {
        data,
        isLoading,
        error,
        // Return info apakah sedang debouncing
        isDebouncing: filters.search !== debouncedSearch
    }
}
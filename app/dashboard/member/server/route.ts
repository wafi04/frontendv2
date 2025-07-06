import { useDebounce } from "@/hooks/useDebounced";
import { api } from "@/lib/axios";
import { PaginationUserResponse } from "@/types/auth";
import { API_RESPONSE, PaginationParams } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface AnalyticsUser extends PaginationParams {
    sortBy?: 'last_active' | 'created' | 'sessions' | 'balance';
    filterStatus?: 'online' | 'active' | 'inactive' | 'dormant' | 'new_user';
}

interface UserAnalyticsResponse {
    users: Array<{
        id: number;
        name: string;
        username: string;
        role: string;
        balance: number;
        isOnline: boolean;
        lastActiveAt: string;
        createdAt: string;
        sessionCount: number;
        status: string;
    }>;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    summary: {
        totalUsers: number;
        onlineUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        dormantUsers: number;
        newUsers: number;
    };
}

export  function useGetAnalyticsUser(filters?: AnalyticsUser) {
    return useQuery({
        queryKey: ["analytics-user", filters],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            
            // Handle pagination
            if (filters?.page) {
                searchParams.set("page", filters.page.toString());
            }
            if (filters?.limit) {
                searchParams.set("limit", filters.limit.toString());
            }
            
            // Handle sorting
            if (filters?.sortBy) {
                searchParams.set("sortBy", filters.sortBy);
            }
            
            // Handle filter status
            if (filters?.filterStatus) {
                searchParams.set("filterStatus", filters.filterStatus);
            }
            
            const response = await api.get(`/admin/user/analytics?${searchParams.toString()}`);
            return response.data;
        },
        staleTime: 30000,
        refetchInterval: 60000,
    });
}



export function useGetAllMemberWithSession(
    {filters} : {filters : {limit : string, page : string, search : string}}
){
    // Debounce search term untuk mengurangi API calls
    const debouncedSearch = useDebounce(filters.search, 500) // 500ms delay
    
    // Buat filters yang sudah di-debounce
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
            
            const req = await api.get<API_RESPONSE<PaginationUserResponse>>(`/auth/all/users?${params.toString()}`)
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
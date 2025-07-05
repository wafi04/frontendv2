import { api } from "@/lib/axios";
import { PaginationParams } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

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

export default function useGetAnalyticsUser(filters?: AnalyticsUser) {
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


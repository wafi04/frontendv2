import { api } from "@/lib/axios";
import { UserData } from "@/types/auth";
import { API_RESPONSE } from "@/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            try {
                const req = await api.get<API_RESPONSE<UserData>>("/auth/me");

                // Basic validation
                if (!req.data || typeof req.data !== "object") {
                    throw new Error("Invalid response format");
                }

                if (!req.data.status) {
                    throw new Error("Authentication failed");
                }

                if (!req.data.data || typeof req.data.data !== "object") {
                    throw new Error("User data not found in response");
                }

                // Validate required fields
                const requiredFields = ["id", "name", "username", "role"] as const;
                for (const field of requiredFields) {
                    if (!req.data.data[field as keyof UserData]) {
                        throw new Error(`Missing required field: ${field}`);
                    }
                }
                
                return req.data;
            } catch (error: any) {
                
                // Check if it's a 401 error
                if (error.response?.status === 401) {
                    try {
                        // Try refresh token
                        if (!isRefreshing) {
                            isRefreshing = true;
                            refreshPromise = api.post('/auth/refresh');
                        }

                        await refreshPromise;

                        // Reset refresh state
                        isRefreshing = false;
                        refreshPromise = null;

                        // Retry original request
                        const retryReq = await api.get<API_RESPONSE<UserData>>("/auth/me");
                        
                        if (!retryReq.data?.status || !retryReq.data?.data) {
                            throw new Error("Invalid response after token refresh");
                        }
                        
                        return retryReq.data;
                    } catch (refreshError: any) {
                        
                        // Reset refresh state
                        isRefreshing = false;
                        refreshPromise = null;
                        
                        // Clear cache and redirect
                        queryClient.removeQueries({ queryKey: ["user"] });
                        router.push('/auth/login');
                 }
                }
                
                // Handle validation errors
                if (error.message?.includes("Invalid response") ||
                    error.message?.includes("Missing required field") ||
                    error.message?.includes("User data not found")) {
                    toast.error(error.message);
                }
                
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            console.log(error, 'retry error');
            
            if (error.response?.status === 401 || error.message === "Request failed with status code 401") {
                return false;
            }
            
            // Don't retry for validation errors
            if (error.message?.includes("Invalid response") ||
                error.message?.includes("Missing required field") ||
                error.message?.includes("Authentication failed") ||
                error.message?.includes("User data not found") ||
                error.message?.includes("Session expired")) {
                return false;
            }
            
            return failureCount < 3;
        },
    });

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.log("Logout error:", error);
        } finally {
            queryClient.removeQueries({ queryKey: ["user"] });
            router.push('/login');
        }
    };

    return {
        data,
        isLoading,
        error,
        user: data?.data || null,
        isAuthenticated: !!data?.data,
        logout,
    };
}
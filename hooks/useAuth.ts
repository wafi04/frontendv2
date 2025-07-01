
import { api } from "@/lib/axios";
import { UserData } from "@/types/auth";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAuth() {
    const { data,isLoading,error}  = useQuery({
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
                // Handle 401 specifically - don't show toast for auth errors
                if (error.response?.status === 401) {
                    throw new Error("UNAUTHORIZED");
                }
                
                // Show toast for other validation errors
                if (error.message.includes("Invalid response") ||
                    error.message.includes("Missing required field") ||
                    error.message.includes("User data not found")) {
                    toast.error(error.message);
                }
                
                throw error;
            }
        },
        staleTime: 5 * 60 * 1000,
        retry: (failureCount, error: any) => {
            // Don't retry for 401 (unauthorized)
            if (error.response?.status === 401 || error.message === "UNAUTHORIZED") {
                return false;
            }
            
            // Don't retry for validation errors
            if (error.message?.includes("Invalid response") ||
                error.message?.includes("Missing required field") ||
                error.message?.includes("Authentication failed") ||
                error.message?.includes("User data not found")) {
                return false;
            }
            
            return failureCount < 3;
        },
    });

    return {
        data,
        isLoading,
        error,
       
    }
}

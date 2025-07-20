import { api } from "@/lib/axios";
import { UserData } from "@/types/auth";
import { API_RESPONSE } from "@/types/response";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data, isLoading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const req = await api.get<API_RESPONSE<UserData>>("/auth/profile");
            return req.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            toast.error('failed to logout')
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
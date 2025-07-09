import { api } from "@/lib/axios";
import { PlatformBalance } from "@/types/balance";
import { API_RESPONSE } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export function useGetAllBalance(){
    const {data,isLoading,error} = useQuery({
        queryKey : ["all-balance"],
        queryFn : async ()  => {
            const  req = await api.get<API_RESPONSE<PlatformBalance[]>>('/balance')
            return req.data
        },
        staleTime : 5 * 60 * 100,
        gcTime : 5 * 60 * 100,
    })


    return {
        data,
        isLoading,
        error
    }
}
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function AuthenticatedLayout(){
    const {data,isLoading,error}  = useQuery({
        queryKey : ["user"],
        queryFn : async ()  => {
            const req =  await  api.get("/auth/me")
            return req.data;
        }
    })

    return {
        data,
        isLoading,
        error
    }
}
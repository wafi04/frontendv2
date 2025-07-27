import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { DepositData } from "../invoice/page";
import { PaginationMeta } from "@/types/category";
import { API_RESPONSE, FilterCategories } from "@/types/response";
import { Transaction } from "@/app/invoice/types";

interface PaginationResponse {
  meta: PaginationMeta;
  data: DepositData[];
}


interface PaginationResponseHistory {
    meta: PaginationMeta;
    data : Transaction[]
}

export function useGetDepositByusername(username?: string, filter?: FilterCategories) {
  const { data, isLoading, error, isError } = useQuery<
    API_RESPONSE<PaginationResponse>,
    Error
  >({
    queryKey: ["deposit", username, filter],
    queryFn: async () => {
      const params = new URLSearchParams();

   
      // Add filter parameters if provided
      if (filter) {
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.search) params.append('search', filter.search);
        
      }

      const response = await api.get<API_RESPONSE<PaginationResponse>>(
        `/deposit/by/username?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    enabled: !!username,      // Only enable query when username is available
    retry: 2,                // Retry failed requests 2 times
  });

  return {
    data: data?.data,
    meta: data?.data.meta,
    isLoading,
    isError,
    error,
  };
}



export function useGetHistoryTransaction(username?: string, filter?: FilterCategories) {
  const { data, isLoading, error, isError } = useQuery<
    API_RESPONSE<PaginationResponseHistory>,
    Error
  >({
    queryKey: ["history", username, filter],
    queryFn: async () => {
      const params = new URLSearchParams();

      

      // Add filter parameters if provided
      if (filter) {
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.page) params.append('page', filter.page.toString());        
      }

      const response = await api.get<API_RESPONSE<PaginationResponseHistory>>(
        `/transactions/history?${params.toString()}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    enabled: !!username,      // Only enable query when username is available
    retry: 2,                // Retry failed requests 2 times
  });

  return {
    data: data?.data,
    meta: data?.data.meta,
    isLoading,
    isError,
    error,
  };
}
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { ServiceOrderResponse } from "@/types/service";
import { useQuery } from "@tanstack/react-query";




export function useGetServiceByCategoryAndSubCategory({
  categoryId,
  subCategoryId
}: {
  categoryId: number;
  subCategoryId?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["service", "category", categoryId, "subCategory", subCategoryId],
    queryFn: async () => {
      let url = `/service/category/${categoryId}`;
      
      // Jika ada subCategoryId, tambahkan sebagai path parameter
      if (subCategoryId && subCategoryId > 0) {
        url += `/${subCategoryId}`;
      }
      
      const response = await api.get<API_RESPONSE<ServiceOrderResponse>>(url);
      return response.data;
    },
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 1,
    retryOnMount: false,
    enabled: !!categoryId,
  });

  return {
    data: data?.data, // Mengakses data.data karena response wrapped
    isLoading,
    error
  };
}
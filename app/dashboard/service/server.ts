import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { ProductWithUserPrice, ServiceOrderResponse } from "@/types/service";
import { useQuery } from "@tanstack/react-query";



export function useGetServiceByCategoryAndSubCategory({
  categoryId,
  subCategoryId,
}: {
  categoryId: number;
  subCategoryId?: number;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["service", "category", categoryId, "subCategory", subCategoryId],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (subCategoryId && subCategoryId > 0) {
        params.set("subCategoryId", subCategoryId.toString());
      }

      const url = `/products?categoryId=${categoryId}${params.toString()}`;

      const response = await api.get<API_RESPONSE<ProductWithUserPrice[]>>(url);
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
    data: data?.data,
    isLoading,
    error,
  };
}

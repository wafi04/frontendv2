import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { FilterSubCategories, SubCategory, SubCategoryReseponseWithPagination } from "@/types/subCategory";
import { FormValuesSubCategory } from "@/validation/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// GET ALL SUBCATEGORIES
export function useGetSubCategories() {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const response = await api.get<API_RESPONSE<SubCategory[]>>("/subcategory");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000, 
  });
}

export function useGetSubCategoryPagination(data: FilterSubCategories) {
  return useQuery({
    queryKey: ["subcategories", "pagination", data], // Include data in queryKey untuk auto-refetch
    queryFn: async (): Promise<SubCategoryReseponseWithPagination> => {
      // Build query params properly
      const params = new URLSearchParams()
      
      if (data.limit) params.append('limit', data.limit)
      if (data.page) params.append('page', data.page)
      if (data.search) params.append('search', data.search)
      if (data.status) params.append('status', data.status)

      const response = await api.get<SubCategoryReseponseWithPagination>(
        `/subcategory/pagination?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!data, 
  })
}

// GET SUBCATEGORY BY ID
export function useGetSubCategoryById(id: number) {
  return useQuery({
    queryKey: ["subcategory", id],
    queryFn: async () => {
      const response = await api.get<API_RESPONSE<SubCategory>>(`/subcategory/${id}`);
      return response.data;
    },
    enabled: !!id && id > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// CREATE SUBCATEGORY
export function useCreateSubCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: FormValuesSubCategory) => {
      const response = await api.post<API_RESPONSE<SubCategory>>(
        "/subcategory",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      toast.success(data.message || "SubCategory created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        "Failed to create subcategory";
      
      // Handle validation errors
      if (error?.response?.data?.details) {
        const validationErrors = error.response.data.details
          .map((err: any) => err.message)
          .join(", ");
        toast.error(`Validation Error: ${validationErrors}`);
      } else {
        toast.error(errorMessage);
      }
    },
  });
}

// UPDATE SUBCATEGORY
export function useUpdateSubCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormValuesSubCategory }) => {
      const response = await api.put<API_RESPONSE<SubCategory>>(
        `/subcategory/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update specific subcategory cache
      queryClient.setQueryData(
        ["subcategory", variables.id],
        data
      );
      
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      
      toast.success(data.message || "SubCategory updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        "Failed to update subcategory";
      
      // Handle validation errors
      if (error?.response?.data?.details) {
        const validationErrors = error.response.data.details
          .map((err: any) => err.message)
          .join(", ");
        toast.error(`Validation Error: ${validationErrors}`);
      } else {
        toast.error(errorMessage);
      }
    },
  });
}

// DELETE SUBCATEGORY
export function useDeleteSubCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete<API_RESPONSE<SubCategory>>(
        `/subcategory/${id}`
      );
      return response.data;
    },
    onSuccess: (data, id) => {
      // Remove from specific cache
      queryClient.removeQueries({ queryKey: ["subcategory", id] });
      
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      
      toast.success(data.message || "SubCategory deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 
        error?.response?.data?.error || 
        "Failed to delete subcategory";
      
      toast.error(errorMessage);
    },
  });
}

// BULK DELETE SUBCATEGORIES (Optional - if you need it)
export function useBulkDeleteSubCategories() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: number[]) => {
      const promises = ids.map(id => 
        api.delete<API_RESPONSE<SubCategory>>(`/subcategory/${id}`)
      );
      const responses = await Promise.all(promises);
      return responses.map(response => response.data);
    },
    onSuccess: (data, ids) => {
      // Remove from specific caches
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ["subcategory", id] });
      });
      
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: ["subcategories"] });
      
      toast.success(`${ids.length} subcategories deleted successfully`);
    },
    onError: (error: any) => {
      const errorMessage = "Failed to delete some subcategories";
      toast.error(errorMessage);
    },
  });
}

// PREFETCH SUBCATEGORY (for better UX)
export function usePrefetchSubCategory() {
  const queryClient = useQueryClient();
  
  return (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["subcategory", id],
      queryFn: async () => {
        const response = await api.get<API_RESPONSE<SubCategory>>(`/subcategory/${id}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// SEARCH SUBCATEGORIES (if you want to add search functionality)
export function useSearchSubCategories(searchTerm: string) {
  return useQuery({
    queryKey: ["subcategories", "search", searchTerm],
    queryFn: async () => {
      const response = await api.get<API_RESPONSE<SubCategory[]>>(
        `/subcategory?search=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    },
    enabled: searchTerm.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search results
  });
}

// CUSTOM HOOK FOR FORM INTEGRATION
export function useSubCategoryForm() {
  const createMutation = useCreateSubCategory();
  const updateMutation = useUpdateSubCategory();
  
  const handleSubmit = async (
    data: FormValuesSubCategory, 
    id?: number
  ) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      return true;
    } catch (error) {
      return false;
    }
  };
  
  return {
    handleSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isSuccess: createMutation.isSuccess || updateMutation.isSuccess,
    error: createMutation.error || updateMutation.error,
  };
}
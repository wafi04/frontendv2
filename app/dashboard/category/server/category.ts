import { api } from "@/lib/axios";
import { CategoryData, CategoryReseponseWithPagination, CategoryResponse, SingleCategoryResponse } from "@/types/category";
import { API_RESPONSE, FilterCategories } from "@/types/response";
import { FormValuesCategory } from "@/validation/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


// GET /categories - Get all categories
export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryResponse> => {
      const response = await api.get<API_RESPONSE<CategoryData[]>>(
        "/category"
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
export function useGetCategoriesByType(type: string) {
  return useQuery({
    queryKey: ["categories","type",type],
    queryFn: async (): Promise<CategoryResponse> => {
      const response = await api.get<API_RESPONSE<CategoryData[]>>(
        `/category/type/${type}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, 
  });
}
export function useGetCategoryPagination(data: FilterCategories) {
  return useQuery({
    queryKey: ["categories", "pagination", data], // Include data in queryKey untuk auto-refetch
    queryFn: async (): Promise<CategoryReseponseWithPagination> => {
      // Build query params properly
      const params = new URLSearchParams()
      
      if (data.limit) params.append('limit', data.limit)
      if (data.page) params.append('page', data.page)
      if (data.search) params.append('search', data.search)
      if (data.status) params.append('status', data.status)

      const response = await api.get<CategoryReseponseWithPagination>(
        `/category/pagination?${params.toString()}`
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!data, 
  })
}

// GET /categories/:id - Get category by ID
export function useGetCategory(id: number) {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async (): Promise<SingleCategoryResponse> => {
      const response = await api.get<API_RESPONSE<CategoryData>>(
        `/category/${id}`
      );
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, 
  });
}

// POST /categories - Create new category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: FormValuesCategory
    ): Promise<SingleCategoryResponse> => {
      const response = await api.post<API_RESPONSE<CategoryData>>(
        "/category",
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
    },
  });
}

// PUT /categories/:id - Update category
export function useUpdateCategory(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormValuesCategory) => {
      const response = await api.put(`/category/${id}`, data);
      return response.data;
    },
    onSuccess: (data) => {
      const filter = {
        limit : 10,
        page: 1,
        status: "active",
      }
      // Invalidate specific category and all categories
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories", id] });
      queryClient.invalidateQueries({
      queryKey: ["categories", "pagination",filter ] });
      toast.success("Category updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update category";
      toast.error(errorMessage);
    },
  });
}

// DELETE /categories/:id - Delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/category/${id}`);
      return response.data;
    },
    onSuccess: (data, deletedId) => {
      queryClient.setQueryData(
        ["categories"],
        (oldData: CategoryResponse | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((category) => category.id !== deletedId),
          };
        }
      );

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.removeQueries({ queryKey: ["categories", deletedId] });

      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete category";
      toast.error(errorMessage);
    },
  });
}



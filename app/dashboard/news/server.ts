import { api } from "@/lib/axios";
import { News, NewsData } from "@/types/news";
import { API_RESPONSE } from "@/types/response";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";



export default function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: News) => {
      try {
        const response = await api.post<API_RESPONSE<NewsData>>('/news', data);
        return response.data;
      } catch (error: any) {
        // Handle API error response
        if (error.response?.data) {
          const errorData = error.response.data 
          throw new Error(errorData.message || 'Failed to create news');
        }
        throw new Error('Network error occurred');
      }
    },
    
    onSuccess: (data) => {
      // Tampilkan pesan success dari API
      toast.success(data.message || 'News created successfully');
      
      // Invalidate dan refetch news list
      queryClient.invalidateQueries({ queryKey: ['news'] });
      
      // Optional: Update cache secara optimistic
      queryClient.setQueryData(['news'], (oldData: any) => {
        if (oldData?.data?.news) {
          return {
            ...oldData,
            data: {
              ...oldData.data,
              news: [data.data, ...oldData.data.news],
              pagination: {
                ...oldData.data.pagination,
                totalItems: oldData.data.pagination.totalItems + 1
              }
            }
          };
        }
        return oldData;
      });
    },
    
    onError: (error) => {
      // Tampilkan error message
      toast.error(error.message || 'Failed to create news');
      console.error('Create news error:', error);
    },
    
    // Optional: Optimistic updates
    onMutate: async (newNews) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['news'] });
      
      // Snapshot previous value
      const previousNews = queryClient.getQueryData(['news']);
      
      // Optimistically update cache
      queryClient.setQueryData(['news'], (old: any) => {
        if (old?.data?.news) {
          const optimisticNews = {
            ...newNews,
            id: Date.now(), // Temporary ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          return {
            ...old,
            data: {
              ...old.data,
              news: [optimisticNews, ...old.data.news],
              pagination: {
                ...old.data.pagination,
                totalItems: old.data.pagination.totalItems + 1
              }
            }
          };
        }
        return old;
      });
      
      return { previousNews };
    },
    
    // If mutation fails, use context to rollback
    onSettled: () => {
      // Always refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['news'] });
    }
  });
}



export function useUpdateNews(id : number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: News) => {
            try {
                const response = await api.put<API_RESPONSE<NewsData>>(`/news/${id}`, data);
                return response.data;
            } catch (error: any) {
                // Handle API error response
                if (error.response?.data) {
                    const errorData = error.response.data;
                    throw new Error(errorData.message || 'Failed to update news');
                }
                throw new Error('Network error occurred');
            }
        },
        onError: () => {
            // Tampilkan error message
            toast.error('Failed to update news');            
        },
        onSuccess: (data) => {
            // Tampilkan pesan success dari API
            toast.success(data.message || 'News updated successfully');
            // Invalidate dan refetch news list
            queryClient.invalidateQueries({ queryKey: ['news'] });
            // Optional: Update cache secara optimistic
            queryClient.setQueryData(['news'], (oldData: any) => {
                if (oldData?.data?.news) {
                    const updatedNews = oldData.data.news.map((news: NewsData) => {
                        if (news.id === data.data.id) {
                            return {
                                ...news,
                                ...data.data
                            };
                        }
                        return news;
                    });
                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            news: updatedNews
                        }
                    };
                }
                return oldData;
            });
        }
    })
}


export function useGetAllNews({
    search,
    status
}: {
    search? : string
    status? : 'active' | 'inactive' | 'all'
}) {
    return useQuery({
        queryKey: ['news'],

        queryFn: async () => {
            const searchParams = new URLSearchParams();
                if (search) searchParams.set('search', search);
                if (status) searchParams.set('status', status);
            const response = await api.get<API_RESPONSE<NewsData[]>>(`/news?${searchParams.toString()}`);
            return response.data;
        },
       gcTime: 5 * 60 * 1000,
       staleTime : 5 * 60 * 1000,
    })
}



export function useDeleteNews() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete<API_RESPONSE<NewsData>>(`/news/${id}`);
            return response.data;
        },
        onError: () => {
            // Tampilkan error message
            toast.error('Failed to delete news');
        },
        onSuccess: (data) => {
            // Tampilkan pesan success dari API
            toast.success(data.message || 'News deleted successfully');
            // Invalidate dan refetch news list
            queryClient.invalidateQueries({ queryKey: ['news'] });
            // Optional: Update cache secara optimistic
            queryClient.setQueryData(['news'], (oldData: any) => {
                if (oldData?.data?.news) {
                    const updatedNews = oldData.data.news.filter((news: NewsData) => news.id !== data.data.id);
                    return {
                        ...oldData,
                        data: {
                            ...oldData.data,
                            news: updatedNews
                        }
                    };
                }
                return oldData;
            });
        },
        onMutate: async (id: number) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['news'] });
            
            // Snapshot previous value
            const previousNews = queryClient.getQueryData(['news']);
            
            // Optimistically update cache
            queryClient.setQueryData(['news'], (old: any) => {
                if (old?.data?.news) {
                    const updatedNews = old.data.news.filter((news: NewsData) => news.id !== id);
                    return {
                        ...old,
                        data: {
                            ...old.data,
                            news: updatedNews,
                            pagination: {
                                ...old.data.pagination,
                                totalItems: old.data.pagination.totalItems - 1
                            }
                        }
                    };
                }
                return old;
            });
            
            return { previousNews };
        }

    })
}
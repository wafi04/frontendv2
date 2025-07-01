import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { CreateVoucherInput, UseVoucherInput, ValidateVoucherInput, VoucherData, VoucherFilters, VoucherReseponseWithPagination } from "@/types/voucher";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const voucherKeys = {
  all: ['vouchers'] as const,
  lists: () => [...voucherKeys.all, 'list'] as const,
  list: (filters: VoucherFilters) => [...voucherKeys.lists(), filters] as const,
  details: () => [...voucherKeys.all, 'detail'] as const,
  detail: (id: number) => [...voucherKeys.details(), id] as const,
  byCode: (code: string) => [...voucherKeys.all, 'code', code] as const,
};

// Get all vouchers
export function useVouchers(filters: VoucherFilters = {}) {
  return useQuery({
    queryKey: voucherKeys.list(filters),
    queryFn: async() =>{
        const params = new URLSearchParams();
    
    if (filters.isActive) params.append('isActive', filters.isActive);
    if (filters.discountType) params.append('discountType', filters.discountType);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
        const req = await api.get<API_RESPONSE<VoucherReseponseWithPagination>>(`/voucher?${params.toString()}`)
        return req.data
    } ,
    staleTime: 5 * 60 * 1000, 
  });
}

// Get voucher by ID
export function useVoucher(id: number) {
  return useQuery({
    queryKey: voucherKeys.detail(id),
      queryFn: async() =>   {
          const req = await api.get<API_RESPONSE<VoucherData>>(`/voucher/${id}`)
          return req.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get voucher by code
export function useVoucherByCode(code: string) {
  return useQuery({
    queryKey: voucherKeys.byCode(code),
      queryFn: async() => {
           const req = await api.get<API_RESPONSE<VoucherData>>(`/voucher/code/${code}`)
          return req.data
    },
    enabled: !!code,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create voucher
export function useCreateVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (data: CreateVoucherInput) => {
          const req = await api.post<API_RESPONSE<VoucherData>>(`/voucher`,data)
          return req.data
      },
    onSuccess: (data) => {
      // Invalidate and refetch vouchers list
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      
      // Add the new voucher to cache
      queryClient.setQueryData(
        voucherKeys.detail(data.data.id),
        data
      );

      toast.success('Voucher created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create voucher');
    },
  });
}

// Update voucher
export function useUpdateVoucher(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async ({id,data} : {id : number, data : VoucherData}) => {
          const req = await api.put<API_RESPONSE<VoucherData>>(`/voucher/${id}`,data)
          return req.data
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch vouchers list
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      
      // Update the specific voucher cache
      queryClient.setQueryData(
        voucherKeys.detail(variables.id),
        data
      );

      // Invalidate voucher by code cache if code changed
      if (variables.data.code) {
        queryClient.invalidateQueries({ 
          queryKey: voucherKeys.byCode(variables.data.code) 
        });
      }

      toast.success('Voucher updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update voucher');
    },
  });
}

// Delete voucher
export function useDeleteVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (id : number) => {
          const req = await api.delete<API_RESPONSE<VoucherData>>(`/voucher/${id}`)
        return req.data
    },
    onSuccess: (_, voucherId) => {
      // Invalidate and refetch vouchers list
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });
      
      // Remove the specific voucher from cache
      queryClient.removeQueries({ queryKey: voucherKeys.detail(voucherId) });

      toast.success('Voucher deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete voucher');
    },
  });
}

// Validate voucher
export function useValidateVoucher() {
  return useMutation({
      mutationFn: async (data : ValidateVoucherInput) => {
          const req = await api.post<API_RESPONSE<VoucherData>>(`/voucher/validate`, data)
          return req.data
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Invalid voucher');
    },
  });
}

// Use voucher
export function useUseVoucher() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async (data : UseVoucherInput) => {
          const req = await api.post<API_RESPONSE<VoucherData>>(`/voucher/use`, data)
          return req.data
          
    },
    onSuccess: (data, variables) => {
      // Invalidate voucher cache since usage count changed
      queryClient.invalidateQueries({ 
        queryKey: voucherKeys.detail(variables.voucherId) 
      });
      
      // Invalidate vouchers list to refresh usage counts
      queryClient.invalidateQueries({ queryKey: voucherKeys.lists() });

      toast.success('Voucher used successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to use voucher');
    },
  });
}

// Clear cache
export function useClearVoucherCache() {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async () => {
          const req = await api.post<API_RESPONSE<VoucherData>>(`/voucher/cache/clear`)
          return req.data
    },
    onSuccess: () => {
      // Invalidate all voucher queries
      queryClient.invalidateQueries({ queryKey: voucherKeys.all });
      toast.success('Cache cleared successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to clear cache');
    },
  });
}
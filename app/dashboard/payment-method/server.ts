import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { PaymentMethod } from "@/types/paymentMethod";
import { MethodSchemas } from "@/validation/paymentMethod";
import { toast } from "sonner";
interface UseGetPaymentMethodsParams {
  status?: string;
  type?: string;
  enabled?: boolean; // Optional parameter to control query execution
}
export function useGetPaymentMethods(
  { 
    status = "active", 
    type,
    enabled = true 
  }: UseGetPaymentMethodsParams = {}
) {
  return useQuery({
    queryKey: ["paymentMethods", { status, type }], // Include params in queryKey for better caching
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      
      // Add parameters to searchParams if they exist
      if (status) {
        searchParams.append("status", status);
      }
      
      if (type) {
        searchParams.append("type", type);
      }
      
      // Build URL with search params
      const queryString = searchParams.toString();
      const url = `/payment-methods${queryString ? `?${queryString}` : ""}`;
      
      const res = await api.get<API_RESPONSE<PaymentMethod[]>>(url);
      
      // Add basic error handling
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch payment methods");
      }
      
      return res.data.data;
    },
    enabled, // Control query execution
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    retry: 3, // Retry failed requests
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MethodSchemas) => {
      const res = await api.post<API_RESPONSE<MethodSchemas>>("/payment-methods", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data.message || "Payment method created successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create payment method");
    },
  });
}


export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MethodSchemas }) => {
      const res = await api.put<API_RESPONSE<MethodSchemas>>(`/payment-methods/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data.message || "Payment method updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update payment method");
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete<API_RESPONSE<PaymentMethod>>(`/payment-methods/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data.message || "Payment method deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete payment method");
    },
  });
}

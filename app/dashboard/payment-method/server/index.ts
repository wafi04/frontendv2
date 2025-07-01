import { api } from "@/lib/axios";
import { PaymentMethodData } from "@/types/paymentMethod";
import { API_RESPONSE } from "@/types/response";
import { MethodSchemas } from "@/validation/method";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useCreatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MethodSchemas) => {
      const res = await api.post<API_RESPONSE<PaymentMethodData>>("/paymentmethod", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data?.message || "Payment method created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create payment method";
      toast.error(errorMessage);
    },
  });
}

export function useGetPaymentMethods() {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      const res = await api.get("/paymentmethod");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPaymentMethodByCode(code: string) {
  return useQuery({
    queryKey: ["paymentMethod", code],
    queryFn: async () => {
      const res = await api.get(`/paymentmethod/${code}`);
      return res.data;
    },
    enabled: !!code,
  });
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MethodSchemas }) => {
      const res = await api.put<API_RESPONSE<PaymentMethodData>>(`/paymentmethod/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data?.message || "Payment method updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update payment method";
      toast.error(errorMessage);
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete<API_RESPONSE<PaymentMethodData>>(`/paymentmethod/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
      toast.success(data?.message || "Payment method deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete payment method";
      toast.error(errorMessage);
    },
  });
}

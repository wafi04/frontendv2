import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { PaymentMethod } from "@/types/paymentMethod";
import { MethodSchemas } from "@/validation/paymentMethod";
import { toast } from "sonner";

export function useGetPaymentMethods({ status = "active" }: { status?: string } = {}) {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: async () => {
      const url = status ? `/payment-methods?status=${status}` : "/payment-methods";
      const res = await api.get<API_RESPONSE<PaymentMethod[]>>(url);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
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

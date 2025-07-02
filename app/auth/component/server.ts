"use client";

import { api } from "@/lib/axios";
import { loginAuth, RegisterAuth, UserResponse } from "@/types/auth";
import { API_RESPONSE, ErrorResponse } from "@/types/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useHandleLogout() {
  const queryClient = useQueryClient();
  const push = useRouter();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const response = await api.post(`/auth/logout?token=${token}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      push.push("/auth/login");
      localStorage.removeItem("token");
      toast.success("Logout Succes");
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred during logout.");
    },
  });
}
export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const push = useRouter();
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: RegisterAuth) => {
      const res = await api.post("/auth/register", data);
      console.log(res);
      return res.data;
    },
    onError: (err: ErrorResponse) => {
      queryClient.cancelQueries({ queryKey: ["user"] });
      toast.error(err.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      push.push("/auth/login");
    },
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const push = useRouter();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: loginAuth) => {
      const res = await api.post<API_RESPONSE<UserResponse>>(
        "/auth/login",
        data
      );
      if(res.success){
        window.location.href = "/"
      }
      return res.data;
    },
    onError: (error: ErrorResponse) => {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";

      queryClient.cancelQueries({ queryKey: ["user"] });
      toast.error(`Error: ${errorMessage}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Login Success");
      push.push("/");
    },
  });
};
import axiosClient from "@/lib/axiosClient";
import { ApiResponse } from "@/lib/response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await axiosClient.post<ApiResponse>("/auth/sign-out");
    },
    onSuccess: (response) => {
      toast.success(response.data.detail);
      queryClient.clear();
      router.replace("/auth/signin");
    },
    onError: (error) => {
      router.replace("/auth/signin");
    },
  });
};

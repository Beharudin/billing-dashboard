import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RootState } from "../../../store";
import { useSelector } from "react-redux";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

export const useAccountAvailability = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const checkAccountAvailabilityMutation = useMutation({
    mutationFn: async (data: { accountNumber: string; bankCode: string }) => {
      const res = await fetch(`${baseUrl}/accounts/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message ?? "Failed to check account availability"
        );
      }
      const result = await res.json();
      
      // Check if the account validation was successful
      if (!result.data?.verified || result.data?.status === "FAILED") {
        throw new Error("Account validation failed");
      }
      
      return result;
    },
    onSuccess: () => {
      toast.success(`Account is available`);
    },
    onError: () => {
      toast.error("Failed to verify account");
    },
  });

  return {
    checkAccountAvailability: checkAccountAvailabilityMutation.mutateAsync,
    isCheckAccountLoading: checkAccountAvailabilityMutation.isPending,
    checkAccountError: checkAccountAvailabilityMutation.error,
  };
};

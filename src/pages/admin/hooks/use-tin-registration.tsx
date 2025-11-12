import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

export const useTinRegistration = () => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const fetchRegistrationInfoMutation = useMutation({
    mutationFn: async (tin: string) => {
      const res = await fetch(`${baseUrl}/external/business/${tin}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();

        // Handle 503 Service Unavailable specifically
        if (res.status === 503) {
          const serviceUnavailableError = new Error("SERVICE_UNAVAILABLE");
          serviceUnavailableError.message =
            errorData.message ??
            "External business registry service is currently unavailable";
          toast.error(serviceUnavailableError.message);
          throw serviceUnavailableError;
        }

        // Handle other errors normally
        toast.error(errorData.message ?? "Failed to fetch business data");
        throw new Error(errorData.message ?? "Failed to fetch business data");
      }

      const resData = await res.json();
      const data = resData.data;

      // Return the mock data with the requested TIN (deep copy to avoid mutation)
      // Wrap in a 'data' property to match the expected API response structure
      return {
        data: {
          ...data,
          registrationInfo: {
            ...data.registrationInfo,
            Tin: tin, // Use the provided TIN
            Businesses: data.registrationInfo.Businesses.map(
              (business: any) => ({
                ...business,
                OwnerTIN: tin,
              })
            ),
          },
        },
      };
    },
    onSuccess: () => {
      toast.success("Business data fetched successfully");
    },
    onError: (error: any) => {
      if (error.message !== "SERVICE_UNAVAILABLE") {
        return;
      }
    },
  });

  return {
    fetchRegistrationInfo: fetchRegistrationInfoMutation.mutateAsync,
    isFetchingRegistrationInfo: fetchRegistrationInfoMutation.isPending,
    fetchRegistrationInfoError: fetchRegistrationInfoMutation.error,
    isServiceUnavailable:
      fetchRegistrationInfoMutation.error?.message === "SERVICE_UNAVAILABLE",
  };
};

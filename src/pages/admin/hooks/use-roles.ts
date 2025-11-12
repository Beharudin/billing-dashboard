import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

interface UseRolesProps {
  isFetchRoles?: boolean;
}

const fetchRoles = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/roles`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch roles");
    throw new Error(errorData.message ?? "Failed to fetch roles");
  }
  const data = await res.json();
  return data ?? [];
};

export const useRoles = ({ isFetchRoles = false }: UseRolesProps = {}) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: roles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchRoles(accessToken ?? ""),
    enabled: isFetchRoles ?? false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    roles,
    isLoading,
    error,
  };
};

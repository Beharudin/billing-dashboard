import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

interface UseKpiProps {
  isFetchKpi?: boolean;
  isFetchDistributions?: boolean;
  isFetchGrowth?: boolean;
  year?: string;
  limit?: number;
  isFetchRecentTransactions?: boolean;
}

const fetchKpi = async (accessToken: string) => {
  const today = new Date().toISOString().split("T")[0];
  const res = await fetch(
    `${baseUrl}/dashboard/entity-statistics?date=${today}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch statistics");
    throw new Error(errorData.message ?? "Failed to fetch statistics");
  }
  const data = await res.json();
  return data ?? [];
};

const fetchRecentTransactions = async (accessToken: string, limit: number) => {
  const res = await fetch(
    `${baseUrl}/transactions/credit/recent?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch recent transactions");
    throw new Error(errorData.message ?? "Failed to fetch recent transactions");
  }
  const data = await res.json();
  return data ?? [];
};

const fetchDistributions = async (accessToken: string, year: number) => {
  const res = await fetch(
    `${baseUrl}/dashboard/user-distribution?year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch user distribution data");
    throw new Error(
      errorData.message ?? "Failed to fetch user distribution data"
    );
  }
  const data = await res.json();
  return data ?? [];
};

const fetchYtdGrowth = async (accessToken: string, year?: number) => {
  const res = await fetch(
    `${baseUrl}/dashboard/ytd-entity-growth?year=${year}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch growth data");
    throw new Error(errorData.message ?? "Failed to fetch growth data");
  }
  const data = await res.json();
  return data ?? [];
};

export const useHomeStats = ({
  isFetchKpi = false,
  isFetchDistributions = false,
  isFetchGrowth = false,
  year,
  limit = 5,
  isFetchRecentTransactions = false,
}: UseKpiProps = {}) => {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: kpi,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kpi"],
    queryFn: () => fetchKpi(accessToken ?? ""),
    enabled: isFetchKpi ?? false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const {
    data: recentTransactions,
    isLoading: recentTransactionsLoading,
    error: recentTransactionsError,
  } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: () => fetchRecentTransactions(accessToken ?? "", limit),
    enabled: isFetchRecentTransactions ?? false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const {
    data: distributions,
    isLoading: distributionsLoading,
    error: distributionsError,
  } = useQuery({
    queryKey: ["distributions", year],
    queryFn: () =>
      fetchDistributions(accessToken ?? "", parseInt(year ?? "", 10)),
    enabled: isFetchDistributions ?? false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const {
    data: growth,
    isLoading: growthLoading,
    error: growthError,
  } = useQuery({
    queryKey: ["growth", year],
    queryFn: () => fetchYtdGrowth(accessToken ?? "", parseInt(year ?? "", 10)),
    enabled: isFetchGrowth ?? false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  return {
    kpi: kpi,
    isLoading,
    error,
    distributions: distributions,
    distributionsLoading,
    distributionsError,
    growth,
    growthLoading,
    growthError,
    recentTransactions,
    recentTransactionsLoading,
    recentTransactionsError,
  };
};

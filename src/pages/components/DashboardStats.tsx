import { StatCardProps } from "../../constants/general";
import { useHomeStats } from "../admin/hooks/use-home";
import StatCard from "./StatCard";
import { Skeleton } from "../../common/ui/skeleton";
import { Card, CardContent, CardHeader } from "../../common/ui/card";
import { useMemo } from "react";

const StatCardSkeleton = () => (
  <Card className="dark:bg-slate-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </CardHeader>
    <CardContent>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  const { kpi, isLoading } = useHomeStats({ isFetchKpi: true });

  const statsData = useMemo(
    () =>
      kpi?.map((item: any) => ({
        ...item,
        change: Math.abs(item.changePercentage),
        trend: item.changePercentage >= 0 ? "up" : "down",
      })),
    [kpi]
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {(statsData as StatCardProps[])?.map(
        (stat: StatCardProps, index: number) => (
          <StatCard key={stat.entityType} index={index} {...stat} />
        )
      )}
    </div>
  );
};

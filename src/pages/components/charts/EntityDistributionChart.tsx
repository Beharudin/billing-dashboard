import { useState, useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../common/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../common/ui/select";
import { useHomeStats } from "../../admin/hooks/use-home";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const COLORS = ["#00aeef", "#00C49F", "#FFBB28", "#FF8042"];

// Skeleton component for loading state
const ChartSkeleton = () => {
  const skeletonLabels = [
    { angle: 0, width: "w-20" }, // Right
    { angle: 90, width: "w-24" }, // Bottom
    { angle: 180, width: "w-16" }, // Left
    { angle: 270, width: "w-28" }, // Top
  ];

  return (
    <div className="flex justify-center items-center h-[250px]">
      <div className="relative">
        {/* Circular skeleton for pie chart */}
        <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>

        {/* Distributed skeleton labels around the circle */}
        {skeletonLabels.map((label, index) => {
          const baseRadius = 95; // Increased base distance from center
          const radian = (label.angle * Math.PI) / 180;
          const x = baseRadius * Math.cos(radian);
          const y = baseRadius * Math.sin(radian);

          // Adjust positioning based on angle to prevent overlap
          let leftOffset = -50; // Default offset
          let topOffset = -8; // Default offset

          // Special adjustments for right and left labels
          if (label.angle === 0) {
            // Right
            leftOffset = -20; // Move further right
          } else if (label.angle === 180) {
            // Left
            leftOffset = -80; // Move further left
          }

          return (
            <div
              key={index}
              className="absolute flex items-center space-x-2"
              style={{
                left: `calc(50% + ${x}px + ${leftOffset}px)`,
                top: `calc(50% + ${y}px + ${topOffset}px)`,
              }}
            >
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
              <div
                className={`${label.width} h-3 bg-gray-200 rounded animate-pulse`}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EntityDistributionChart = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { distributions, distributionsLoading, distributionsError } =
    useHomeStats({
      isFetchDistributions: true,
      year: selectedYear.toString(),
    });

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value, 10));
  };

  // Transform distributions data to chart format
  const entityData = useMemo(() => {
    if (!distributions || !Array.isArray(distributions)) return [];

    return distributions.map((item: any) => ({
      name: item.entityType,
      value: item.entityCount,
      percentage: item.distributionPercentage,
    }));
  }, [distributions]);

  const isLoading = distributionsLoading;
  const isError = distributionsError;

  const totalValue = entityData.reduce(
    (sum: number, entry: any) => sum + entry.value,
    0
  );
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    value,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 15; // Reduced from default ~30 to 15
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percent =
      totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : "0.0";
    const color = COLORS[index % COLORS.length];

    return (
      <text
        x={x}
        y={y}
        fill={color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name}: ${percent}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Distribution</CardTitle>
            <CardDescription>{selectedYear} yearly data.</CardDescription>
          </div>
          <div>
            <Select
              onValueChange={(value) => handleYearChange(value)}
              value={selectedYear.toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString() || "0"}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <div className="flex justify-center items-center h-[250px]">
            <div className="text-red-500">
              Failed to load data. Please try again.
            </div>
          </div>
        ) : entityData.length === 0 ? (
          <div className="flex justify-center items-center h-[250px]">
            <div className="text-gray-500">
              No data available for the selected year.
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={0}
                endAngle={360}
                data={entityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={renderCustomLabel}
                legendType="circle"
                labelLine={false}
              >
                {entityData.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityDistributionChart;

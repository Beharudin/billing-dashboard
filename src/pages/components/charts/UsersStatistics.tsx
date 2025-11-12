import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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

// Skeleton loading component
const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[250px] flex flex-col space-y-4 animate-pulse">
      {/* Chart area skeleton */}
      <div className="flex-1 bg-gray-200 rounded-lg"></div>

      {/* Legend skeleton */}
      <div className="flex justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-300 rounded"></div>
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-orange-300 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-purple-300 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-green-300 rounded"></div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const EntityStatsChart: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { growth, growthLoading, growthError } = useHomeStats({
    isFetchGrowth: true,
    year: selectedYear.toString(),
  });

  // Transform API data to chart format
  const entityData = useMemo(() => {
    if (!growth || !Array.isArray(growth)) return [];

    // Group data by month
    const monthlyData: { [key: string]: any } = {};

    growth.forEach((item: any) => {
      const month = item.outputDataMonth;
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month };
      }

      // Map entity types to chart keys
      const entityType = item.outputEntityType.toLowerCase();
      if (entityType === "agents") {
        monthlyData[month].agents = item.outputCumulativeCount;
      } else if (entityType === "institutions") {
        monthlyData[month].institutions = item.outputCumulativeCount;
      } else if (entityType === "manufacturies") {
        monthlyData[month].manufacturies = item.outputCumulativeCount;
      } else if (entityType === "consumers") {
        monthlyData[month].consumers = item.outputCumulativeCount;
      }
    });

    // Convert to array and sort by month order
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthOrder
      .filter((month) => monthlyData[month])
      .map((month) => monthlyData[month]);
  }, [growth]);

  const handleYearChange = (value: string) => {
    setSelectedYear(parseInt(value, 10));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Statistics</CardTitle>
            <CardDescription>
              {selectedYear} users growth and activity data.
            </CardDescription>
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
                  <SelectItem key={year} value={year.toString() || ""}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        {growthLoading ? (
          <ChartSkeleton />
        ) : growthError ? (
          <div className="flex justify-center items-center h-[250px] text-red-500">
            Error loading data. Please try again.
          </div>
        ) : entityData.length === 0 ? (
          <div className="flex justify-center items-center h-[250px]">
            No data available for the selected year.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={entityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="agents"
                name="Agents"
                stroke="#00aeef"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="institutions"
                name="Institutions"
                stroke="#f97316"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="manufacturies"
                name="Manufacturies"
                stroke="#a855f7"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="consumers"
                name="Consumers"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EntityStatsChart;

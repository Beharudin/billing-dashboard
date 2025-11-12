import {
  ArrowDown,
  ArrowUp,
  Building2,
  User2,
  UserCircle2,
  Users2,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../common/ui/card";
import { StatCardProps } from "../../constants/general";

const StatCard: React.FC<StatCardProps> = ({
  entityType,
  currentCount,
  changePercentage,
  trend,
  index,
}) => {
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;

  const cardConfig = {
    0: {
      icon: UserCircle2,
      textClass: "text-emerald-500",
      bgClass: "bg-emerald-100",
    },
    1: {
      icon: Building2,
      textClass: "text-orange-500",
      bgClass: "bg-orange-100",
    },
    2: {
      icon: Users2,
      textClass: "text-purple-500",
      bgClass: "bg-purple-100",
    },
    3: {
      icon: User2,
      textClass: "text-cyan-500",
      bgClass: "bg-cyan-100",
    },
  };

  const config = cardConfig[index as keyof typeof cardConfig] || cardConfig[0];
  const { icon: Icon, textClass, bgClass } = config;

  return (
    <Card className="dark:bg-slate-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3">
        <CardTitle
          className={`text-lg font-medium ${textClass} dark:text-slate-200`}
        >
          {entityType}
        </CardTitle>
        <div className={`p-3 ${bgClass} rounded-full`}>
          <Icon className={textClass} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div
              className={`text-2xl font-bold ${textClass} dark:text-slate-200`}
            >
              {currentCount}
            </div>
            <p className="text-xs text-muted-foreground flex items-center space-x-2">
              <span
                className={`${textClass} text-lg flex items-center dark:text-slate-200`}
              >
                <TrendIcon className="w-5 h-5" />
                {changePercentage}%
              </span>

              <span>from last month</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

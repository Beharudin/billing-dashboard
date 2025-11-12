import React from "react";
import { RequestPriority } from "../../constants/interface/admin/request";
import { Badge } from "./badge";

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  const priorityConfig = {
    LOW: {
      variant: "secondary" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    MEDIUM: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    HIGH: {
      variant: "secondary" as const,
      className: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    URGENT: {
      variant: "destructive" as const,
      className: "bg-red-100 text-red-800 hover:bg-red-200",
    },
  };

  const config = priorityConfig[priority];

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {priority}
    </Badge>
  );
};

export default PriorityBadge;

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Loader,
  XCircle,
} from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

const statusConfig = {
  DRAFT: {
    colorClass:
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: FileText,
    label: "Draft",
  },
  PENDING: {
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    label: "Pending",
  },
  APPROVED: {
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: {
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: XCircle,
    label: "Rejected",
  },
  IN_PROGRESS: {
    colorClass: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: Loader,
    label: "In Progress",
  },
  COMPLETED: {
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    label: "Completed",
  },
  CANCELLED: {
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: XCircle,
    label: "Cancelled",
  },
  HIGH: {
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: AlertTriangle,
    label: "High Priority",
  },
  MEDIUM: {
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: AlertTriangle,
    label: "Medium Priority",
  },
  LOW: {
    colorClass: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: Clock,
    label: "Low Priority",
  },
  URGENT: {
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: AlertTriangle,
    label: "Urgent",
  },
  ACTIVE: {
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    label: "Active",
  },
  INACTIVE: {
    colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: XCircle,
    label: "Inactive",
  },
  UNDER_REVIEW: {
    colorClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    label: "Under Review",
  },
  PENDING_PARTNER_APPROVAL: {
    colorClass:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: Clock,
    label: "Pending Partner Approval",
  },
  PENDING_SUPER_ADMIN_APPROVAL: {
    colorClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: Clock,
    label: "Pending Super Admin Approval",
  },
  DISBURSED: {
    colorClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    label: "Disbursed",
  },
} as const;

type StatusType = keyof typeof statusConfig;

interface StatusBadgeProps {
  status: StatusType;
  showIcon?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = false,
  className = "",
}) => {
  const config = statusConfig[status];

  if (!config) {
    console.warn(`Unknown status: ${status}`);
    return null;
  }

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "px-4 py-1.5 rounded-full text-xs font-medium border-0",
        config.colorClass,
        className
      )}
    >
      {showIcon && <Icon className="w-3 h-3 mr-1 inline" />}
      {config.label}
    </span>
  );
};

export { StatusBadge, type StatusType };


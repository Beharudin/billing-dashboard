import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "../../../../common/ui/badge";
import { Log } from "../../../../constants/interface/admin/log";

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "failed":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "high":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "critical":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      return (
        <div className="font-medium">
          {format(new Date(timestamp), "MMM dd, yyyy HH:mm:ss")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("action")}</div>
    ),
  },
  {
    accessorKey: "performedBy",
    header: "Performed By",
    cell: ({ row }) => (
      <div className="text-sm">{row.getValue("performedBy")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.getValue("severity") as string;
      return (
        <Badge className={getSeverityColor(severity)}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.getValue("module")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate text-sm">
        {row.getValue("description")}
      </div>
    ),
  },
];

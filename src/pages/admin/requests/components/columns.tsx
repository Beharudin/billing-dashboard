import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../../common/ui/button";
import { Checkbox } from "../../../../common/ui/checkbox";
import { StatusBadge } from "../../../../common/ui/status-badge";
import { LoanApplication } from "../../../../constants/interface/admin/request";
import { getStatusLabel } from "../../../../lib/utils";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<LoanApplication>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "applicationNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Application Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link to={`${row.original.id}`}>
        <Button variant="link" className="text-slate-600 hover:text-cyan-500">
          {row.original.applicationNumber}
        </Button>
      </Link>
    ),
  },
  {
    accessorKey: "loanTypeName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Loan Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes((row.getValue(id) as boolean).toString());
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      // Map loan application statuses to simplified status categories
      const getSimplifiedStatus = (status: string) => {
        switch (status) {
          case "APPROVED":
            return "APPROVED";
          case "DISBURSED":
            return "DISBURSED";
          case "PARTNER_APPROVED":
            return "APPROVED";
          case "REJECTED":
          case "PARTNER_REJECTED":
          case "AGENT_REJECTED":
          case "CANCELLED":
            return "REJECTED";
          default:
            return "PENDING";
        }
      };

      const simplifiedStatus = getSimplifiedStatus(status);
      return <StatusBadge status={simplifiedStatus} />;
    },
  },
  {
    accessorKey: "statusDetails",
    header: "Status Details",
    cell: ({ row }) => {
      const status = row.original.status;
      return <span>{getStatusLabel(status)}</span>;
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return value.includes((row.getValue(id) as boolean).toString());
    },
  },
  {
    accessorKey: "requestedAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Requested Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      `ETB ${row.original.requestedAmount?.toLocaleString() ?? 0}`,
  },
  {
    accessorKey: "approvedAmount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Approved Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) =>
      row.original.approvedAmount
        ? `ETB ${row.original.approvedAmount.toLocaleString()}`
        : "-",
  },
  {
    accessorKey: "tenureMonths",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Tenure
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.original.tenureMonths} months`,
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const rowValue = row.getValue(id) as number;
      return value.includes(rowValue);
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Products
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{row.original.products.length} item(s)</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];

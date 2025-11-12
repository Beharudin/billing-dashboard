import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../common/ui/button";
import { StatusBadge } from "../../../../common/ui/status-badge";
import { DocumentType } from "../../../../constants/interface/admin/general";
import { UserDocumentsType } from "../../../../common/data/data";
import { CellActions } from "./cell-actions";

export const columns: ColumnDef<DocumentType>[] = [
  {
    accessorKey: "userTypes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Types
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const userTypes = row.original.userTypes || [];
      if (userTypes.length === 0) return "No user types";
      
      return (
        <div className="flex flex-wrap gap-1">
          {userTypes.map((userType) => {
            const option = UserDocumentsType.find(opt => opt.value === userType);
            return (
              <span
                key={userType}
                className="inline-flex items-center px-2 py-1 bg-cyan-100 text-cyan-500 text-xs rounded-md"
              >
                {option?.label || userType}
              </span>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Document Type Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.isActive ? "ACTIVE" : "INACTIVE";
      return <StatusBadge status={status} />;
    },
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      const rowValue = row.getValue(id) as boolean;
      return value.includes(rowValue);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
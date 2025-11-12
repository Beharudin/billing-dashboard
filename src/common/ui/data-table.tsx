import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Download, LucideIcon } from "lucide-react";
import toast from "react-hot-toast";
import { AlertModal } from "../modals/alert-modal";
import { Button } from "./button";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options: { label: string; value: any }[];
}

// New interface for dynamic action buttons
interface ActionButton<TData> {
  label: string;
  icon: LucideIcon;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "danger";
  onClick: (selectedData: TData[]) => void;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  disabled?: boolean;
  requiredPermissions?: string[];
  className?: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  searchPlaceholder?: string;
  clickable?: boolean;
  getSelectedRow?: (data: TData) => void;
  onExport?: (filtered: string, data: Row<TData>[]) => void;
  facetedFilters?: FacetedFilterConfig[];
  hideSearch?: boolean;
  actionButtons?: ActionButton<TData>[] | ((selectedData: TData[]) => ActionButton<TData>[]);
  showExportButton?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder,
  clickable,
  getSelectedRow,
  onExport,
  facetedFilters,
  hideSearch = false,
  actionButtons = [],
  showExportButton = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [loading, setLoading] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionButton<TData> | null>(null);

  const userAuthorities = localStorage.getItem("authorities");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const onConfirm = async () => {
    try {
      setLoading(true);
      const selectedDataToDelete = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);

      if (selectedDataToDelete.length > 0 && currentAction) {
        currentAction.onClick(selectedDataToDelete);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      setOpen(false);
      setCurrentAction(null);
    }
  };

  const handleActionClick = (action: ActionButton<TData>) => {
    const selectedData = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original);

    if (action.requiresConfirmation) {
      setCurrentAction(action);
      setOpen(true);
    } else {
      action.onClick(selectedData);
    }
  };

  const checkPermissions = (requiredPermissions?: string[]) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!userAuthorities) return false;
    
    return requiredPermissions.some(permission => 
      userAuthorities.includes(permission)
    );
  };

  // Get selected data for dynamic filtering
  const selectedData = table.getFilteredSelectedRowModel().rows.map(row => row.original);
  
  // Resolve action buttons (handle both array and function types)
  const allActionButtons = typeof actionButtons === 'function' 
    ? actionButtons(selectedData) 
    : actionButtons;

  return (
    <div className="w-full flex flex-col space-y-4">
      <AlertModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setCurrentAction(null);
        }}
        onConfirm={onConfirm}
        loading={loading}
        title={currentAction?.confirmationTitle}
        description={currentAction?.confirmationDescription}
        variant={currentAction?.variant === "destructive" ? "destructive" : "default"}
      />
      <div className="flex items-center py-4">
        {!hideSearch && (
          <Input
            placeholder={`Search by ${searchPlaceholder ?? searchKey}`}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm ml-2"
          />
        )}
        <div className="flex w-full items-center justify-between">
          <div className="ml-2">
            <DataTableToolbar table={table} facetedFilters={facetedFilters} />
          </div>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex space-x-2">
              <div className="flex items-center justify-center gap-2">
                {/* Render dynamic action buttons */}
                {allActionButtons.map((action, index) => {
                  const hasPermission = checkPermissions(action.requiredPermissions);
                  const isDisabled = action.disabled || !hasPermission || loading;
                  
                  return (
                    <div
                      key={index}
                      className={`${!hasPermission && "cursor-not-allowed"}`}
                      title={!hasPermission ? "Not Authorized" : ""}
                    >
                      <Button
                        className={`ml-2 border ${action.className || ""}`}
                        size="sm"
                        onClick={() => handleActionClick(action)}
                        variant={action.variant || "default"}
                        disabled={isDisabled}
                      >
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Button>
                    </div>
                  );
                })}
                
                {/* Export button */}
                {showExportButton && onExport && (
                  <Button
                    className="ml-2 border"
                    size="sm"
                    onClick={() =>
                      onExport(
                        "filtered",
                        table.getFilteredSelectedRowModel().rows
                      )
                    }
                    variant="outline"
                    disabled={loading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-accent">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`${clickable && "cursor-pointer"}`}
                onClick={() => clickable && getSelectedRow?.(row.original)}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ textAlign: "center" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}

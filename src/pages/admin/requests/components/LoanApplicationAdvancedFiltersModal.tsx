import { Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../common/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../common/ui/dialog";
import { Input } from "../../../../common/ui/input";
import { Label } from "../../../../common/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../common/ui/select";
import { LoanApplicationStatus } from "../../../../constants/interface/admin/request";
import { useAdvancedFiltersModal } from "../../hooks/use-advanced-filters-modal";

interface LoanApplicationAdvancedFilters {
  status?: LoanApplicationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  loanAmountMin?: number;
  loanAmountMax?: number;
  loanType?: string;
}

interface LoanApplicationAdvancedFiltersModalProps {
  onApplyFilters: (filters: LoanApplicationAdvancedFilters) => void;
  currentFilters?: LoanApplicationAdvancedFilters;
}

export const LoanApplicationAdvancedFiltersModal = ({
  onApplyFilters,
  currentFilters,
}: LoanApplicationAdvancedFiltersModalProps) => {
  const { isOpen, onClose } = useAdvancedFiltersModal();
  const [filters, setFilters] = useState<LoanApplicationAdvancedFilters>(currentFilters || {});

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  const handleClose = () => {
    setFilters(currentFilters || {});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Advanced Filters
          </DialogTitle>
          <DialogDescription>
            Apply advanced filters to narrow down your loan application search.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value as LoanApplicationStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING_PARTNER_APPROVAL">Pending Partner Approval</SelectItem>
                  <SelectItem value="PARTNER_APPROVED">Partner Approved</SelectItem>
                  <SelectItem value="PARTNER_REJECTED">Partner Rejected</SelectItem>
                  <SelectItem value="PENDING_SUPER_ADMIN_APPROVAL">Pending Super Admin Approval</SelectItem>
                  <SelectItem value="PENDING_AGENT_CONFIRMATION">Pending Agent Confirmation</SelectItem>
                  <SelectItem value="AGENT_REJECTED">Agent Rejected</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="DISBURSED">Disbursed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loanType">Loan Type</Label>
              <Select
                value={filters.loanType}
                onValueChange={(value) =>
                  setFilters({ ...filters, loanType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Goods Purchase Financing">Goods Purchase Financing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={
                  filters.dateFrom
                    ? filters.dateFrom.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateFrom: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={
                  filters.dateTo
                    ? filters.dateTo.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dateTo: e.target.value
                      ? new Date(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="loanAmountMin">Min Loan Amount</Label>
              <Input
                id="loanAmountMin"
                type="number"
                placeholder="0.00"
                value={filters.loanAmountMin || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    loanAmountMin: parseFloat(e.target.value) || undefined,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="loanAmountMax">Max Loan Amount</Label>
              <Input
                id="loanAmountMax"
                type="number"
                placeholder="0.00"
                value={filters.loanAmountMax || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    loanAmountMax: parseFloat(e.target.value) || undefined,
                  })
                }
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

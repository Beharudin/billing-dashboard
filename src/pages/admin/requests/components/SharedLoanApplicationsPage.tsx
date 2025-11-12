import { Check, Download, Filter, X } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../../../common/ui/button";
import { Card } from "../../../../common/ui/card";
import { DataTable } from "../../../../common/ui/data-table";
import { Heading } from "../../../../common/ui/heading";
import { Input } from "../../../../common/ui/input";
import { LoanApplication } from "../../../../constants/interface/admin/request";
import { getPartnerIdFromToken } from "../../../../lib/jwt-utils";
import { useAdvancedFiltersModal } from "../../hooks/use-advanced-filters-modal";
import { useLoanApplications } from "../../hooks/use-loan-applications";
import { AdvancedFilters, LoanApplicationPageConfig } from "../types";
import ExportRequestsDataToExcel from "./ExportRequestsDataToExcel";
import { LoanApplicationAdvancedFiltersModal } from "./LoanApplicationAdvancedFiltersModal";
import { columns } from "./columns";

interface SharedLoanApplicationsPageProps {
  config: LoanApplicationPageConfig;
}

const SharedLoanApplicationsPage = ({
  config,
}: SharedLoanApplicationsPageProps) => {
  const { onOpen: openAdvancedFilters } = useAdvancedFiltersModal();
  const { loanApplications, isLoading, handleApproveLoan, handleRejectLoan } =
    useLoanApplications();

  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  // Determine which data and loading state to use
  const sourceData = config.useCustomData
    ? config.customData
    : loanApplications;
  const sourceLoading = config.useCustomData ? config.customLoading : isLoading;

  const filteredApplications = useMemo(() => {
    if (!sourceData || !Array.isArray(sourceData)) return [];

    // Apply the page-specific filter first
    const pageFilteredData = config.filterFunction(sourceData);

    return pageFilteredData.filter((application) => {
      // Apply advanced filters
      if (
        advancedFilters.status &&
        application.status !== advancedFilters.status
      ) {
        return false;
      }
      if (
        advancedFilters.loanType &&
        !application.loanTypeName.includes(advancedFilters.loanType)
      ) {
        return false;
      }
      if (
        advancedFilters.loanAmountMin &&
        application.requestedAmount < advancedFilters.loanAmountMin
      ) {
        return false;
      }
      if (
        advancedFilters.loanAmountMax &&
        application.requestedAmount > advancedFilters.loanAmountMax
      ) {
        return false;
      }
      if (
        advancedFilters.dateFrom &&
        new Date(application.createdAt) < advancedFilters.dateFrom
      ) {
        return false;
      }
      if (
        advancedFilters.dateTo &&
        new Date(application.createdAt) > advancedFilters.dateTo
      ) {
        return false;
      }

      // Apply search query across multiple fields
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const searchableFields = [
          application.applicationNumber,
          application.loanTypeName,
          application.status,
          application.tenureMonths.toString(),
        ];

        const matchesSearch = searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        );

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }, [sourceData, config.filterFunction, advancedFilters, searchQuery]);

  // Extract partner ID from the current user's token
  const partnerId = getPartnerIdFromToken();

  // Bulk action functions
  const approveSelectedApplications = async (
    selectedApplications: LoanApplication[]
  ) => {
    if (!partnerId) {
      toast.error("Partner ID not found in token");
      return;
    }

    try {
      await Promise.all(
        selectedApplications.map((application) =>
          handleApproveLoan({
            applicationNumber: application.applicationNumber,
            approvalData: {
              partnerId,
              approved: true,
            },
          })
        )
      );
      toast.success(
        `${selectedApplications.length} loan application(s) approved successfully`
      );
    } catch (error) {
      toast.error("Failed to approve loan applications");
    }
  };

  const rejectSelectedApplications = async (
    selectedApplications: LoanApplication[]
  ) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason?.trim()) {
      toast.error("Rejection reason is required");
      return;
    }

    if (!partnerId) {
      toast.error("Partner ID not found in token");
      return;
    }

    try {
      await Promise.all(
        selectedApplications.map((application) =>
          handleRejectLoan({
            applicationNumber: application.applicationNumber,
            rejectionData: {
              partnerId,
              approved: false,
              rejectionReason: reason,
            },
          })
        )
      );
      toast.success(
        `${selectedApplications.length} loan application(s) rejected successfully`
      );
    } catch (error) {
      toast.error("Failed to reject loan applications");
    }
  };

  // Helper function to filter action buttons based on selected applications' statuses
  const getActionButtons = (selectedApplications: LoanApplication[]) => {
    if (selectedApplications.length === 0) return [];

    const selectedStatuses = selectedApplications.map(
      (application) => application.status
    );

    const filteredButtons = [];

    // Partner-specific approval workflow logic
    const canApprove = (status: string) => {
      return status === "PENDING_PARTNER_APPROVAL";
    };

    const canReject = (status: string) => {
      const rejectableStatuses = [
        "PENDING_PARTNER_APPROVAL",
        "PENDING_AGENT_CONFIRMATION",
        "PARTNER_APPROVED",
      ];
      return rejectableStatuses.includes(status);
    };

    // Approve button: only show if all selected applications can be approved
    const canApproveAll = selectedStatuses.every(canApprove);
    if (canApproveAll) {
      filteredButtons.push({
        label: "Approve",
        icon: Check,
        variant: "success" as const,
        onClick: (selectedApplications: LoanApplication[]) =>
          approveSelectedApplications(selectedApplications),
        requiresConfirmation: true,
        confirmationTitle: "Approve Selected Loan Applications",
        confirmationDescription:
          "Are you sure you want to approve the selected loan applications? This action will move them to the next stage in the approval process.",
      });
    }

    // Reject button: only show if all selected applications can be rejected
    const canRejectAll = selectedStatuses.every(canReject);
    if (canRejectAll) {
      filteredButtons.push({
        label: "Reject",
        icon: X,
        variant: "destructive" as const,
        onClick: (selectedApplications: LoanApplication[]) =>
          rejectSelectedApplications(selectedApplications),
        requiresConfirmation: true,
        confirmationTitle: "Reject Selected Loan Applications",
        confirmationDescription:
          "Are you sure you want to reject the selected loan applications? This action cannot be undone.",
      });
    }

    return filteredButtons;
  };

  const handleApplyAdvancedFilters = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
  };

  if (sourceLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading loan requests...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <LoanApplicationAdvancedFiltersModal
        onApplyFilters={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
      />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`${config.title} (${filteredApplications?.length ?? 0})`}
            description={config.description}
          />
          <div></div>
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              onClick={openAdvancedFilters}
              size="sm"
              className="px-2 sm:px-4"
            >
              <Filter className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Advanced Filters</span>
            </Button>

            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-600 px-2 sm:px-4"
              onClick={() =>
                ExportRequestsDataToExcel(
                  "notfiltered",
                  filteredApplications ?? []
                )
              }
              title="Export All"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>
        </div>
        <div className="w-full flex flex-col space-y-4">
          {/* Custom Search Input */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Search by application number"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="max-w-sm"
            />
          </div>

          <DataTable
            searchKey="applicationNumber"
            searchPlaceholder="Search by application number"
            clickable={true}
            columns={columns}
            data={filteredApplications ?? []}
            onExport={ExportRequestsDataToExcel}
            actionButtons={getActionButtons}
            hideSearch={true}
            facetedFilters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  {
                    label: "Pending Partner Approval",
                    value: "PENDING_PARTNER_APPROVAL",
                  },
                  { label: "Partner Approved", value: "PARTNER_APPROVED" },
                  { label: "Partner Rejected", value: "PARTNER_REJECTED" },
                  {
                    label: "Pending Super Admin Approval",
                    value: "PENDING_SUPER_ADMIN_APPROVAL",
                  },
                  {
                    label: "Pending Agent Confirmation",
                    value: "PENDING_AGENT_CONFIRMATION",
                  },
                  { label: "Agent Rejected", value: "AGENT_REJECTED" },
                  { label: "Approved", value: "APPROVED" },
                  { label: "Disbursed", value: "DISBURSED" },
                  { label: "Rejected", value: "REJECTED" },
                  { label: "Cancelled", value: "CANCELLED" },
                ],
              },
              {
                columnId: "loanTypeName",
                title: "Loan Type",
                options: [
                  {
                    label: "Goods Purchase Financing",
                    value: "Goods Purchase Financing",
                  },
                ],
              },
              {
                columnId: "tenureMonths",
                title: "Tenure (Months)",
                options: [
                  { label: "1 Month", value: 1 },
                  { label: "6 Months", value: 6 },
                  { label: "12 Months", value: 12 },
                  { label: "18 Months", value: 18 },
                ],
              },
            ]}
          />
        </div>
      </Card>
    </>
  );
};

export default SharedLoanApplicationsPage;

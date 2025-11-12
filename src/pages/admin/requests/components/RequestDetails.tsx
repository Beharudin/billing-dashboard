import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  FileText,
  User,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../../common/Loader";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import { StatusBadge } from "../../../../common/ui/status-badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../common/ui/tabs";
import { Textarea } from "../../../../common/ui/textarea";
import { Agent } from "../../../../constants/interface/admin/agent";
import { Manufacturer } from "../../../../constants/interface/admin/manufacturer";
import { Product } from "../../../../constants/interface/admin/request";
import { getPartnerIdFromToken } from "../../../../lib/jwt-utils";
import { getStatusLabel } from "../../../../lib/utils";
import InfoField from "../../components/InfoField";
import { useAgents } from "../../hooks/use-agents";
import { useLoanApplications } from "../../hooks/use-loan-applications";
import { useManufacturers } from "../../hooks/use-manufacturers";
import AgentDetailsCard from "./AgentDetailsCard";
import ManufacturerDetailsCard from "./ManufacturerDetailsCard";
import TinDetailsCard from "./TinDetailsCard";

// Reusable Error State Component
interface ErrorStateProps {
  onBack: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ onBack }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6 flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 dark:text-red-400 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
        Loan Request Not Found
      </h2>
      <p className="text-gray-600 dark:text-slate-300 mb-4">
        The requested loan application could not be found.
      </p>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Loan Requests
      </Button>
    </div>
  </div>
);

const RequestDetails: React.FC = () => {
  const { id: requestId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    loanApplications,
    isLoading,
    handleApproveLoan,
    handleRejectLoan,
    isApproveLoading,
    isRejectLoading,
  } = useLoanApplications();
  const { agents } = useAgents({
    isFetchAgents: true,
  });
  const { manufacturers } = useManufacturers({
    isFetchManufacturers: true,
  });

  // Modal state management
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Extract partner ID from the current user's token
  const partnerId = getPartnerIdFromToken();

  // Find the specific loan application from the array
  const request = loanApplications?.find(
    (app) => String(app.id) === String(requestId)
  );

  const agent = agents?.find((a: Agent) => a.id === Number(request?.agentId));

  // Derive manufacturers from factoryIds (array) or fall back to single factoryId
  const requestedFactoryIds = Array.from(
    new Set(
      (
        ((request as any)?.factoryIds as string[] | undefined) ??
        (request?.factoryId ? [String(request.factoryId)] : [])
      ).map(String)
    )
  );

  const manufacturersForRequest =
    manufacturers?.filter((m: Manufacturer) =>
      requestedFactoryIds.includes(String(m.id))
    ) ?? [];

  const onApprove = async () => {
    if (!partnerId) {
      console.error("Partner ID not found in token");
      return;
    }

    if (!request) {
      console.error("Request not found");
      return;
    }

    try {
      await handleApproveLoan({
        applicationNumber: request.applicationNumber,
        approvalData: {
          partnerId,
          approved: true,
        },
      });
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setOpenApprove(false);
    }
  };

  const onReject = async () => {
    if (!rejectReason.trim()) {
      return;
    }

    if (!partnerId) {
      console.error("Partner ID not found in token");
      return;
    }

    if (!request) {
      console.error("Request not found");
      return;
    }

    try {
      await handleRejectLoan({
        applicationNumber: request.applicationNumber,
        rejectionData: {
          partnerId,
          approved: false,
          rejectionReason: rejectReason,
        },
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
    } finally {
      setOpenReject(false);
      setRejectReason("");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state - check if loanApplications is loaded but request not found
  if (!isLoading && (!loanApplications || !request)) {
    return <ErrorState onBack={handleBack} />;
  }

  // Early return if request is still undefined (TypeScript safety)
  if (!request) {
    return <Loader />;
  }

  // Partner-specific approval workflow logic
  const canApprove = () => {
    const approvableStatuses = ["PENDING_PARTNER_APPROVAL", "PARTNER_REJECTED"];
    return approvableStatuses.includes(request.status);
  };

  const canReject = () => {
    const rejectableStatuses = ["PENDING_PARTNER_APPROVAL", "PARTNER_APPROVED"];
    return rejectableStatuses.includes(request.status);
  };

  return (
    <Card className="px-5 pt-5 pb-10 dark:bg-slate-800 dark:border-slate-700">
      {/* Header with Back Button and Quick Actions */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Loan Requests
        </Button>

        {/* Quick Actions Buttons */}
        <div className="flex items-center space-x-2">
          {canApprove() && (
            <Button
              size="sm"
              onClick={() => setOpenApprove(true)}
              disabled={isApproveLoading}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isApproveLoading ? "Approving..." : "Approve"}
            </Button>
          )}
          {canReject() && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setOpenReject(true)}
              disabled={isRejectLoading}
            >
              <XCircle className="w-4 h-4 mr-2" />
              {isRejectLoading ? "Rejecting..." : "Reject"}
            </Button>
          )}
        </div>
      </div>

      {/* Request Header with Details */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold dark:text-slate-100">
                {request.loanTypeName}
              </h1>
              <p className="text-gray-600 dark:text-slate-400">
                {request.applicationNumber} • {getStatusLabel(request.status)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <StatusBadge
                status={(() => {
                  // Map loan application statuses to simplified status categories
                  const getSimplifiedStatus = (status: string) => {
                    switch (status) {
                      case "APPROVED":
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
                  return getSimplifiedStatus(request.status);
                })()}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoField
                label="Application Number"
                value={request.applicationNumber}
              />
              <InfoField
                label="Requested Amount"
                value={`ETB ${request.requestedAmount?.toLocaleString()}`}
              />
              <InfoField
                label="Approved Amount"
                value={
                  request.approvedAmount
                    ? `ETB ${request.approvedAmount?.toLocaleString()}`
                    : "Not approved yet"
                }
              />
              <InfoField
                label="Tenure"
                value={`${request.tenureMonths} months`}
              />
            </div>
            <div className="space-y-4">
              {request.interestRate && (
                <InfoField
                  label="Interest Rate"
                  value={`${request.interestRate}%`}
                />
              )}
              {request.processingFee && (
                <InfoField
                  label="Processing Fee"
                  value={`ETB ${request.processingFee?.toLocaleString()}`}
                />
              )}
              <InfoField
                label="Created Date"
                value={new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
              <InfoField
                label="Updated Date"
                value={new Date(request.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Sections */}
      <Tabs defaultValue="agent" className="w-full">
        <TabsList className="grid w-full grid-cols-4 dark:bg-slate-700 mb-5">
          <TabsTrigger
            value="agent"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Agent Details
          </TabsTrigger>
          <TabsTrigger
            value="tin"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            TIN Registry
          </TabsTrigger>
          <TabsTrigger
            value="manufacturer"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Manufacturer Details
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="dark:data-[state=active]:bg-slate-600 dark:text-slate-200"
          >
            Products
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <FileText className="w-5 h-5" />
                <span>Products</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-slate-600">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        Product Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        Category
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        Quantity
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        Unit Price
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.products?.map(
                      (product: Product, index: number) => (
                        <tr
                          key={product.id}
                          className={`border-b border-gray-100 dark:border-slate-700 ${
                            index % 2 === 0
                              ? "bg-gray-50 dark:bg-slate-800/50"
                              : "bg-white dark:bg-slate-800"
                          }`}
                        >
                          <td className="py-3 px-4 text-gray-900 dark:text-slate-100">
                            {product.productName}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                            {product.productCategory || "N/A"}
                          </td>
                          <td className="py-3 px-4 text-center text-gray-900 dark:text-slate-100">
                            {product.productQuantity}
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900 dark:text-slate-100">
                            ETB{" "}
                            {product.productUnitPrice?.toLocaleString() || "0"}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-slate-100">
                            ETB{" "}
                            {product.productTotalPrice?.toLocaleString() || "0"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300 dark:border-slate-500 bg-gray-100 dark:bg-slate-700">
                      <td
                        colSpan={4}
                        className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-slate-100"
                      >
                        Total Amount:
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-lg text-gray-900 dark:text-slate-100">
                        ETB{" "}
                        {request.products
                          ?.reduce(
                            (total: number, product: Product) =>
                              total + (product.productTotalPrice || 0),
                            0
                          )
                          .toLocaleString() || "0"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agent Details Tab */}
        <TabsContent value="agent">
          {agent ? (
            <AgentDetailsCard agent={agent} />
          ) : (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <User className="w-5 h-5" />
                  <span>Agent Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 dark:text-slate-400">
                  Agent information not available for this request
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* TIN Registry Tab */}
        <TabsContent value="tin">
          {agent ? (
            <TinDetailsCard
              // tin={agent.taxIdentificationNumber ?? ""}
              tin={"0009100609"}
              agentName={agent.fullName}
            />
          ) : (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>TIN Registry</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 dark:text-slate-400">
                  TIN not available because agent details could not be loaded.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Manufacturer Details Tab */}
        <TabsContent value="manufacturer">
          {manufacturersForRequest.length > 0 ? (
            <>
              {manufacturersForRequest.map((m: Manufacturer) => (
                <ManufacturerDetailsCard key={m.id} manufacturer={m} />
              ))}
            </>
          ) : (
            <Card className="dark:bg-slate-800 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                  <FileText className="w-5 h-5" />
                  <span>Manufacturer Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-slate-400">
                    No manufacturer details available for this request
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Approve Modal */}
      <AlertModal
        isOpen={openApprove}
        onClose={() => setOpenApprove(false)}
        onConfirm={onApprove}
        loading={isApproveLoading}
        title="Approve Request"
        description="Are you sure you want to approve this loan request?"
        variant="success"
      />

      {/* Reject Modal */}
      <AlertModal
        isOpen={openReject}
        onClose={() => {
          setOpenReject(false);
          setRejectReason("");
        }}
        onConfirm={onReject}
        loading={isRejectLoading}
        title="Reject Request"
        description="Please provide a reason for rejecting this loan request:"
        content={
          <div className="mt-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>
        }
      />
    </Card>
  );
};

export default RequestDetails;

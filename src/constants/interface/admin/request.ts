export type LoanApplicationStatus =
  | "DRAFT" // Loan request created but not yet submitted (rarely used now)
  | "SUBMITTED" // Loan application submitted for approval (rarely used now)
  | "PENDING_PARTNER_APPROVAL" // Waiting for partner approval (external module) - default on creation
  | "PARTNER_APPROVED" // Partner approved, waiting for super admin approval
  | "PARTNER_REJECTED" // Rejected by partner
  | "PENDING_SUPER_ADMIN_APPROVAL" // Waiting for super admin approval
  | "PENDING_AGENT_CONFIRMATION" // Super admin approved, waiting for agent to accept
  | "AGENT_REJECTED" // Agent rejected the loan offer
  | "APPROVED" // Agent accepted, invoice generated, ready for disbursement
  | "DISBURSED" // Funds disbursed to factory after agent receives goods
  | "REJECTED" // Loan rejected by super admin
  | "CANCELLED"; // Loan application cancelled

export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Product {
  id: number;
  productId: string;
  productName: string;
  productCategory: string;
  productQuantity: number;
  productUnitPrice: number;
  productTotalPrice: number;
}

export interface LoanApplication {
  id: number;
  applicationNumber: string;
  loanTypeCode: string;
  loanTypeName: string;
  agentId: string;
  factoryId: string;
  products: Product[];
  requestedAmount: number;
  approvedAmount: number | null;
  interestRate: number | null;
  processingFee: number | null;
  tenureMonths: number;
  status: LoanApplicationStatus;
  statusRemarks: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  disbursedAt: string | null;
}

export interface LoanApprovalRejectionRequest {
  partnerId: string;
  approved: boolean;
  rejectionReason?: string;
}

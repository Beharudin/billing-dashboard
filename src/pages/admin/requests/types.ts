import { LoanApplication, LoanApplicationStatus } from "../../../constants/interface/admin/request";

export interface AdvancedFilters {
  status?: LoanApplicationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  loanAmountMin?: number;
  loanAmountMax?: number;
  loanType?: string;
}

export interface LoanApplicationPageConfig {
  title: string;
  description: string;
  filterFunction: (applications: LoanApplication[]) => LoanApplication[];
  useCustomData?: boolean;
  customData?: LoanApplication[];
  customLoading?: boolean;
}
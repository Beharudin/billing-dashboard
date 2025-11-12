import { LoanApplication } from "../../../constants/interface/admin/request";
import { useLoanApplications } from "../hooks/use-loan-applications";
import SharedLoanApplicationsPage from "./components/SharedLoanApplicationsPage";
import { LoanApplicationPageConfig } from "./types";

const PendingLoanRequestManagementPage = () => {
  const { pendingApplications, pendingIsLoading } = useLoanApplications();

  const config: LoanApplicationPageConfig = {
    title: "Pending Loan Applications",
    description: "Manage Pending Loan Applications and Approvals",
    filterFunction: (applications: LoanApplication[]) => applications,
    useCustomData: true,
    customData: pendingApplications,
    customLoading: pendingIsLoading,
  };

  return <SharedLoanApplicationsPage config={config} />;
};

export default PendingLoanRequestManagementPage;

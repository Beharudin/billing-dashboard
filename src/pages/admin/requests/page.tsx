import { LoanApplication } from "../../../constants/interface/admin/request";
import SharedLoanApplicationsPage from "./components/SharedLoanApplicationsPage";
import { LoanApplicationPageConfig } from "./types";

const ActiveLoanRequestManagementPage = () => {
  const config: LoanApplicationPageConfig = {
    title: "Active Loan Applications",
    description: "Manage Active Loan Applications and Approvals",
    filterFunction: (applications: LoanApplication[]) =>
      applications.filter((application) => 
        application.status !== "PENDING_PARTNER_APPROVAL" && 
        application.status !== "DISBURSED"
      ),
  };

  return <SharedLoanApplicationsPage config={config} />;
};

export default ActiveLoanRequestManagementPage;

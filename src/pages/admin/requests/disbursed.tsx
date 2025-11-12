import { LoanApplication } from "../../../constants/interface/admin/request";
import SharedLoanApplicationsPage from "./components/SharedLoanApplicationsPage";
import { LoanApplicationPageConfig } from "./types";

const DisbursedLoanRequestManagementPage = () => {
  const config: LoanApplicationPageConfig = {
    title: "Disbursed Loan Applications",
    description: "Manage Disbursed Loan Applications and Approvals",
    filterFunction: (applications: LoanApplication[]) =>
      applications.filter((application) => application.status === "DISBURSED"),
  };

  return <SharedLoanApplicationsPage config={config} />;
};

export default DisbursedLoanRequestManagementPage;

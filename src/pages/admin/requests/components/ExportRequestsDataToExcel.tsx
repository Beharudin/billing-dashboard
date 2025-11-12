import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "Request ID",
  "Title",
  "Description",
  "Status",
  "Priority",
  "Requested By",
  "Requested Date",
  "Reviewed By",
  "Reviewed Date",
  "Loan Amount",
  "Currency",
  "Loan Purpose",
  "Repayment Period",
  "Monthly Income",
  "Employment Status",
  "Interest Rate",
  "Credit Score",
  "Assigned To",
  "Comments Count",
  "Status Changes Count",
  "Attachments Count",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data: any = filtered ? row.original : row;
  return [
    data.id,
    data.title,
    data.description,
    data.status,
    data.priority,
    data.requestedBy,
    data.requestedDate,
    data.reviewedBy || "N/A",
    data.reviewedDate || "N/A",
    data.loanAmount || "N/A",
    data.currency || "N/A",
    data.loanPurpose || "N/A",
    data.repaymentPeriod || "N/A",
    data.monthlyIncome || "N/A",
    data.employmentStatus || "N/A",
    data.interestRate || "N/A",
    data.creditScore || "N/A",
    data.assignedTo || "N/A",
    data.comments?.length || 0,
    data.statusHistory?.length || 0,
    data.attachments?.length || 0,
    data.createdAt,
    data.updatedAt,
  ];
};

const ExportRequestsDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "Loan_Requests.xlsx", { bookSST: true });
};

export default ExportRequestsDataToExcel;

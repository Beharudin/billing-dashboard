import * as XLSX from "xlsx";

const EXCEL_HEADERS: (string | number)[] = [
  "User Type",
  "Document Type Name",
  "Status",
  "Created At",
  "Updated At",
];

const formatRowData = (row: any, filtered: boolean): (string | number)[] => {
  const data = filtered ? row.original : row;
  return [
    data.id || "N/A",
    data.userType,
    data.name,
    data.isActive ? "Active" : "Inactive",
    data.createdAt || "N/A",
    data.updatedAt || "N/A",
  ];
};

const ExportDocumentTypesDataToExcel = (filtered: string, data: any[]): void => {
  const dynamicData = [
    EXCEL_HEADERS,
    ...data.map((row) => formatRowData(row, filtered === "filtered")),
  ];

  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(dynamicData);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
  XLSX.writeFile(wb, "DocumentTypes.xlsx", { bookSST: true });
};

export default ExportDocumentTypesDataToExcel;
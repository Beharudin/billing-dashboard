import { format } from "date-fns";
import * as XLSX from "xlsx";

const ExportLogsDataToExcel = (fileName: string, data: any[]) => {
  try {
    // Transform the data for Excel export
    const exportData = data.map((log) => ({
      "Log ID": log.id,
      Timestamp: format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss"),
      "Activity Type": log.activityType,
      Action: log.action,
      "Performed By": log.performedBy,
      "Target Entity": log.targetEntity,
      "Target ID": log.targetId || "N/A",
      Status: log.status.charAt(0).toUpperCase() + log.status.slice(1),
      Severity: log.severity.charAt(0).toUpperCase() + log.severity.slice(1),
      Module: log.module,
      Description: log.description,
      "IP Address": log.ipAddress,
      "User Agent": log.userAgent,
      "Additional Details": log.details ? JSON.stringify(log.details) : "None",
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const columnWidths = [
      { wch: 10 }, // Log ID
      { wch: 20 }, // Timestamp
      { wch: 18 }, // Activity Type
      { wch: 20 }, // Action
      { wch: 25 }, // Performed By
      { wch: 15 }, // Target Entity
      { wch: 15 }, // Target ID
      { wch: 10 }, // Status
      { wch: 10 }, // Severity
      { wch: 15 }, // Module
      { wch: 40 }, // Description
      { wch: 15 }, // IP Address
      { wch: 30 }, // User Agent
      { wch: 30 }, // Additional Details
    ];
    worksheet["!cols"] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");

    // Generate filename with timestamp
    const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
    const fullFileName = `${fileName}_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, fullFileName);

    console.log(`Exported ${data.length} log entries to ${fullFileName}`);
  } catch (error) {
    console.error("Error exporting logs to Excel:", error);
    throw new Error("Failed to export logs to Excel");
  }
};

export default ExportLogsDataToExcel;

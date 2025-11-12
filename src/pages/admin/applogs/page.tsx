import { Download, RefreshCw } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useLogs } from "../hooks/use-logs";
import { columns } from "./components/columns";
import ExportLogsDataToExcel from "./components/ExportLogsDataToExcel";

const LogsPage = () => {
  const { logs, isLoading, refreshLogs } = useLogs({ enabled: true });

  return (
    <>
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Activity Logs (${logs?.length || 0})`}
            description="View and monitor all system activities and user actions"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => refreshLogs()}
              disabled={isLoading}
              size="sm"
              className="px-2 sm:px-4"
            >
              <RefreshCw
                className={`h-4 w-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700 px-2 sm:px-4"
              onClick={() => ExportLogsDataToExcel("activity_logs", logs ?? [])}
              disabled={!logs?.length}
              title="Export All"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="description"
          clickable={true}
          columns={columns}
          data={logs ?? []}
          onExport={ExportLogsDataToExcel}
        />
      </Card>
    </>
  );
};

export default LogsPage;

// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/pages/admin/reports-pro/page.tsx
import { reportsMockData } from "../../../common/data/data";

const ReportsProPage = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Pro Reports</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {reportsMockData.map((r) => (
          <div key={r.id} className="rounded-md border p-4 space-y-1">
            <div className="font-medium">{r.title}</div>
            <div className="text-sm">{r.reportType} • {r.status}</div>
            <div className="text-xs text-gray-600">
              Records: {r.totalRecords} • Size: {r.fileSize}
            </div>
            <p className="text-sm">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsProPage;
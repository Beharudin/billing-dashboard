// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/pages/admin/analytics/page.tsx
import { recentTransactions } from "../../../common/data/data";

const AnalyticsPage = () => {
  const totalSales = recentTransactions.reduce((s, t) => s + t.totalSales, 0);
  const totalQty = recentTransactions.reduce((s, t) => s + t.quantity, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Analytics</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md border p-4">
          <div className="text-sm text-gray-600">Total Sales</div>
          <div className="text-lg font-semibold">${totalSales.toLocaleString()}</div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm text-gray-600">Total Quantity</div>
          <div className="text-lg font-semibold">{totalQty.toLocaleString()}</div>
        </div>
        <div className="rounded-md border p-4">
          <div className="text-sm text-gray-600">Transactions</div>
          <div className="text-lg font-semibold">{recentTransactions.length}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
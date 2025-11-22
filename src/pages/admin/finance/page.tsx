// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/pages/admin/finance/page.tsx
import { recentTransactions } from "../../../common/data/data";

const FinancePage = () => {
  const total = recentTransactions.reduce((s, t) => s + t.totalSales, 0);
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Finance</h2>
      <div className="rounded-md border p-4">
        <div className="font-medium mb-2">Recent Transactions</div>
        <div className="text-sm mb-3">Total: ${total.toLocaleString()}</div>
        <div className="space-y-2">
          {recentTransactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <div className="font-medium">{t.productName}</div>
                <div className="text-xs text-gray-600">{t.transactionId} • {t.date}</div>
              </div>
              <div className="text-sm">${t.totalSales.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
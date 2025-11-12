import { Card, CardContent } from "../../../common/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../common/ui/table";
import { Skeleton } from "../../../common/ui/skeleton";
import { useHomeStats } from "../../admin/hooks/use-home";
import { RecentTransaction } from "../../../constants/interface/admin/general";

const RecentTransactionTableSkeleton = () => (
  <Card className="py-5">
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-40" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Consumer</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16 rounded-full" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const RecentTransactionTable = () => {
  const {
    recentTransactions,
    recentTransactionsLoading,
    recentTransactionsError,
  } = useHomeStats({
    isFetchRecentTransactions: true,
    limit: 5,
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format amount for display
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  if (recentTransactionsLoading) {
    return <RecentTransactionTableSkeleton />;
  }

  return (
    <Card className="py-5">
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </div>

        {recentTransactionsError ? (
          <div className="text-center py-8 text-red-500">
            Error loading transactions
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Consumer</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction: RecentTransaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="font-medium">
                      {transaction.transactionId}
                    </TableCell>
                    <TableCell>{transaction.consumerName}</TableCell>
                    <TableCell>{transaction.agentName}</TableCell>
                    <TableCell>{formatAmount(transaction.amount)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.paymentMethod === "CASH"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {transaction.paymentMethod.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {transaction.notes}
                    </TableCell>
                    <TableCell>{formatDate(transaction.recordedAt)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    No recent transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactionTable;

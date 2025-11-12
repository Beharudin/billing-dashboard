import React from "react";
import { DashboardStats } from "../../components/DashboardStats";
import TodayActivityCard from "../../components/cards/TodayActivityCard";
import EntityDistributionChart from "../../components/charts/EntityDistributionChart";
import TopSellingChart from "../../components/charts/TopSellingChart";
import UsersStatsChart from "../../components/charts/UsersStatistics";
import RecentTransactionTable from "../../components/tables/RecentTransactionTable";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6">
        {/* Left Side - Charts Grid */}
        <div className="xl:col-span-9 space-y-4 md:space-y-6">
          <UsersStatsChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EntityDistributionChart />
            <TopSellingChart />
          </div>
        </div>

        {/* Right Side - Larger Height Card */}
        <div className="xl:col-span-3">
          <TodayActivityCard />
        </div>
      </div>

      {/* Latest Transactions Table */}
      <div className="space-y-4">
        <RecentTransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;

import { ROLES } from "../../config/permissions";
import Logs from "../../pages/admin/applogs/page";
import DocumentTypesPage from "../../pages/admin/document-types/page";
import Dashboard from "../../pages/admin/home/Dashboard";
import SettingsPage from "../../pages/admin/settings/page";
import UsersPage from "../../pages/admin/users/page";
import BillingPage from "../../pages/admin/billing/page";
import ReportsProPage from "../../pages/admin/reports-pro/page";
import AnalyticsPage from "../../pages/admin/analytics/page";
import FinancePage from "../../pages/admin/finance/page";
import InventoryPage from "../../pages/admin/inventory/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },

  {
    path: "billing",
    title: "Billing",
    element: <BillingPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },

  // System Management Routes
  {
    path: "users",
    title: "Users",
    element: <UsersPage />,
    roles: [ROLES.ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    path: "document-types",
    title: "Document Types",
    element: <DocumentTypesPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["basic_monthly", "basic_yearly", "pro_monthly", "pro_yearly"],
  },
  {
    path: "logs",
    title: "Logs",
    element: <Logs />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    path: "settings",
    title: "Settings",
    element: <SettingsPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["basic_monthly", "basic_yearly", "pro_monthly", "pro_yearly"],
  },
  {
    path: "reports-pro",
    title: "Reports (Pro)",
    element: <ReportsProPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    path: "analytics",
    title: "Analytics",
    element: <AnalyticsPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    path: "finance",
    title: "Finance",
    element: <FinancePage />,
    roles: [ROLES.ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    path: "inventory",
    title: "Inventory",
    element: <InventoryPage />,
    roles: [ROLES.ADMIN],
    plans: ["basic_monthly", "basic_yearly", "pro_monthly", "pro_yearly"],
  },
];

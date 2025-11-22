import {
  FileBarChart,
  FileText,
  LucideHome,
  Users,
  CreditCard,
  BarChart3,
  Boxes,
  Wallet,
} from "lucide-react";
import { ROLES } from "../../config/permissions";

export const menuItems = [
  {
    label: "Dashboard",
    to: "/admin",
    pathname: "/admin",
    icon: <LucideHome width={18} height={18} />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },
  {
    label: "Billing",
    to: "/admin/billing",
    pathname: "/admin/billing",
    icon: <CreditCard width={18} height={18} />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },

  // System Management
  {
    label: "System Users",
    to: "/admin/users",
    pathname: "/admin/users",
    icon: <Users width={18} height={18} />,
    subMenu: [
      {
        label: "Users",
        to: "/admin/users",
        pathname: "/admin/users",
        icon: <Users width={18} height={18} />,
        roles: [ROLES.ADMIN],
        plans: ["pro_monthly", "pro_yearly"],
      },
      {
        label: "Document Types",
        to: "/admin/document-types",
        pathname: "/admin/document-types",
        icon: <FileText width={18} height={18} />,
        roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
        plans: ["basic_monthly", "basic_yearly", "pro_monthly", "pro_yearly"],
      },
      {
        label: "Logs",
        to: "/admin/logs",
        pathname: "/admin/logs",
        icon: <FileBarChart width={18} height={18} />,
        roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
        plans: ["pro_monthly", "pro_yearly"],
      },
    ],
  },

  {
    label: "Analytics",
    to: "/admin/analytics",
    pathname: "/admin/analytics",
    icon: <BarChart3 width={18} height={18} />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    label: "Reports (Pro)",
    to: "/admin/reports-pro",
    pathname: "/admin/reports-pro",
    icon: <FileBarChart width={18} height={18} />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    label: "Finance",
    to: "/admin/finance",
    pathname: "/admin/finance",
    icon: <Wallet width={18} height={18} />,
    roles: [ROLES.ADMIN],
    plans: ["pro_monthly", "pro_yearly"],
  },
  {
    label: "Inventory",
    to: "/admin/inventory",
    pathname: "/admin/inventory",
    icon: <Boxes width={18} height={18} />,
    roles: [ROLES.ADMIN],
    plans: ["basic_monthly", "basic_yearly", "pro_monthly", "pro_yearly"],
  },
];

import {
  FileBarChart,
  FileText,
  LucideHome,
  Users
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
      },
      {
        label: "Document Types",
        to: "/admin/document-types",
        pathname: "/admin/document-types",
        icon: <FileText width={18} height={18} />,
        roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
      },
      {
        label: "Logs",
        to: "/admin/logs",
        pathname: "/admin/logs",
        icon: <FileBarChart width={18} height={18} />,
        roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
      },
    ],
  },
];

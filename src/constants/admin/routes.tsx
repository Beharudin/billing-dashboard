import { ROLES } from "../../config/permissions";
import Logs from "../../pages/admin/applogs/page";
import DocumentTypesPage from "../../pages/admin/document-types/page";
import Dashboard from "../../pages/admin/home/Dashboard";
import SettingsPage from "../../pages/admin/settings/page";
import UsersPage from "../../pages/admin/users/page";

export const ROUTES = [
  {
    path: "/",
    title: "Home",
    element: <Dashboard />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },

  // System Management Routes
  {
    path: "users",
    title: "Users",
    element: <UsersPage />,
    roles: [ROLES.ADMIN],
  },
  {
    path: "document-types",
    title: "Document Types",
    element: <DocumentTypesPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },
  {
    path: "logs",
    title: "Logs",
    element: <Logs />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },
  {
    path: "settings",
    title: "Settings",
    element: <SettingsPage />,
    roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
  },
];

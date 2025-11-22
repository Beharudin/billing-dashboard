import PageNotFound from "../common/components/PageNotFound";
import Admin from "../pages/admin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import Landing from "../pages/landing";
import { ROLES } from "./permissions";

export const appRoutes = [
  {
    path: "/",
    element: <Landing />,
    roles: null,
  },
  {
    path: "/admin/*",
    element: <Admin />,
    // roles: [ROLES.ADMIN, ROLES.PARTNER_SUB_ADMIN],
    roles: null,
  },
  {
    path: "/login",
    element: <Login />,
    roles: null,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
    roles: null,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    roles: null,
  },
  {
    path: "/not-found",
    element: <PageNotFound />,
    roles: null,
  },
];

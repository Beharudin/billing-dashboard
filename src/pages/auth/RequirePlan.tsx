// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/pages/auth/RequirePlan.tsx
import { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";

type RequirePlanProps = {
  allowedPlans: string[] | null;
  children?: ReactNode;
};

const RequirePlan = ({ allowedPlans, children }: RequirePlanProps) => {
  const { subscription } = useAppSelector((s) => s.billing);
  const location = useLocation();

  if (!allowedPlans) {
    return children ? <>{children}</> : <Outlet />;
  }

  const planKey = subscription?.planKey;
  if (!planKey || !allowedPlans.includes(planKey)) {
    return <Navigate to="/admin/billing" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RequirePlan;
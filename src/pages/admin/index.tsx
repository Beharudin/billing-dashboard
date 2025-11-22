import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PageTitle from "../../components/PageTitle";
import { menuItems } from "../../constants/admin/menu";
import { ROUTES } from "../../constants/admin/routes";
import DefaultLayout from "../../layout/DefaultLayout";
import { useAppDispatch } from "../../store";
import { fetchNotificationsData } from "../../store/notification/notification-extra";
import { fetchBillingData } from "../../store/billing/billing-extra";
import RequireAuth from "../auth/RequireAuth";
import RequirePlan from "../auth/RequirePlan";

const Admin = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchNotificationsData());
    dispatch(fetchBillingData());
  }, []);
  

  return (
    <DefaultLayout menuItems={menuItems} rootPath="/admin">
      <Routes>
        {ROUTES.map(({ title, path, element, roles, plans }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <>
                <PageTitle title={`${title} - Admin Dashboard`} />
                <RequireAuth allowedRoles={roles}>
                  <RequirePlan allowedPlans={plans ?? null}>{element}</RequirePlan>
                </RequireAuth>
              </>
            }
          />
        ))}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </DefaultLayout>
  );
};

export default Admin;

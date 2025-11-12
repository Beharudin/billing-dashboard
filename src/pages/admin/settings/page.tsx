import { useState } from "react";
import { Card } from "../../../common/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../common/ui/tabs";
import ChangePassword from "./components/ChangePassword";
import UserDetails from "./components/UserDetails";

function SettingsPage() {
  const [loading] = useState(false);

  const user = {
    username: "admin_user",
    email: "admin@example.com",
    fullName: "Admin User",
    phoneNumber: "+1234567890",
  };

  if (loading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-5">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold dark:text-slate-200">
              {user?.fullName}
            </h1>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </div>
        </div>

        <Tabs defaultValue="user" className="space-y-6">
          <TabsList className={`grid w-full grid-cols-2 dark:bg-gray-800`}>
            <TabsTrigger
              value="user"
              className="flex items-center gap-2 dark:text-slate-200 dark:data-[state=active]:bg-gray-700"
            >
              User Details
            </TabsTrigger>
            <TabsTrigger
              value="password-change"
              className="flex items-center gap-2 dark:text-slate-200 dark:data-[state=active]:bg-gray-700"
            >
              Change Password
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="user"
            className="dark:rounded-md dark:bg-gray-900/20 dark:p-2"
          >
            {user && <UserDetails defaultValues={user} userLoading={loading} />}
          </TabsContent>

          <TabsContent
            value="password-change"
            className="dark:rounded-md dark:bg-gray-900/20 dark:p-2"
          >
            <ChangePassword />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}

export default SettingsPage;

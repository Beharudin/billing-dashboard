import { Download, Plus } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddUserModal } from "../hooks/use-add-user-modal";
import { useUsers } from "../hooks/use-users";
import { AddUserModal } from "./components/AddUserModal";
import { EditUserModal } from "./components/EditUserModal";
import ExportUsersDataToExcel from "./components/ExportUsersDataToExcel";
import { columns } from "./components/columns";

const UsersPage = () => {
  const { onOpen } = useAddUserModal();
  const { users, isLoading } = useUsers({
    isFetchUsers: true,
  });
  const filteredUsers =
    users?.filter((user: any) => user.userType.typeName !== "SUPER_ADMIN") ||
    [];

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <AddUserModal />
      <EditUserModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Admin Users (${filteredUsers?.length ?? 0})`}
            description="Manage Admin Users"
          />
          <div></div>
          <div className="flex gap-2">
            <Button
              variant={"outline"}
              onClick={() => onOpen()}
              size="sm"
              className="px-2 sm:px-4"
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-600 px-2 sm:px-4"
              onClick={() =>
                ExportUsersDataToExcel("notfiltered", filteredUsers || [])
              }
              title="Export All"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="username"
          searchPlaceholder="Search by name"
          clickable={true}
          columns={columns}
          data={filteredUsers || []}
          onExport={ExportUsersDataToExcel}
          facetedFilters={[
            {
              columnId: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ],
            },
          ]}
        />
      </Card>
    </>
  );
};

export default UsersPage;

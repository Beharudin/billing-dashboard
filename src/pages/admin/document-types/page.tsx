import { Download, Plus } from "lucide-react";
import { Button } from "../../../common/ui/button";
import { Card } from "../../../common/ui/card";
import { DataTable } from "../../../common/ui/data-table";
import { Heading } from "../../../common/ui/heading";
import { useAddDocumentTypeModal } from "../hooks/use-add-document-type-modal";
import { useDocumentTypes } from "../hooks/use-document-types";
import { AddDocumentTypeModal } from "./components/AddDocumentTypeModal";
import { EditDocumentTypeModal } from "./components/EditDocumentTypeModal";
import ExportDocumentTypesDataToExcel from "./components/ExportDocumentTypesDataToExcel";
import { columns } from "./components/columns";
import { UserDocumentsType } from "../../../common/data/data";
import { useAppSelector } from "../../../store";
import { ROLES } from "../../../config/permissions";

const DocumentTypesPage = () => {
  const { onOpen } = useAddDocumentTypeModal();

  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.userType === ROLES.ADMIN;

  const { documentTypes, isLoading } = useDocumentTypes({
    isFetchDocumentTypes: true,
  });

  if (isLoading) {
    return (
      <Card className="p-5">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading document types...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <AddDocumentTypeModal />
      <EditDocumentTypeModal />
      <Card className="p-5">
        <div className="flex border-b pb-2 items-center justify-between">
          <Heading
            title={`Document Types (${documentTypes?.length ?? 0})`}
            description="Manage Document Types"
          />
          <div></div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button
                variant={"outline"}
                onClick={() => onOpen()}
                size="sm"
                className="px-2 sm:px-4"
              >
                <Plus className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Add New</span>
              </Button>
            )}
            <Button
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-600 px-2 sm:px-4"
              onClick={() =>
                ExportDocumentTypesDataToExcel(
                  "notfiltered",
                  documentTypes || []
                )
              }
              title="Export All"
            >
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Export All</span>
            </Button>
          </div>
        </div>
        <DataTable
          searchKey="name"
          searchPlaceholder="Search by document type name"
          clickable={true}
          columns={columns}
          data={documentTypes || []}
          onExport={ExportDocumentTypesDataToExcel}
          facetedFilters={[
            {
              columnId: "isActive",
              title: "Status",
              options: [
                { label: "Active", value: true },
                { label: "Inactive", value: false },
              ],
            },
            {
              columnId: "userTypes",
              title: "User Types",
              options: UserDocumentsType.map((option) => ({
                label: option.label,
                value: option.value,
              })),
            },
          ]}
        />
      </Card>
    </>
  );
};

export default DocumentTypesPage;

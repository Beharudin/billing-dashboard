import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { AlertModal } from "../../../../common/modals/alert-modal";
import { Button } from "../../../../common/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../common/ui/dropdown-menu";
import { DocumentType } from "../../../../constants/interface/admin/general";
import { useDocumentTypes } from "../../hooks/use-document-types";
import { useEditDocumentTypeModal } from "../../hooks/use-edit-document-type-modal";
import { useAppSelector } from "../../../../store";
import { ROLES } from "../../../../config/permissions";

interface CellActionsProps {
  data: DocumentType;
}

export const CellActions: React.FC<CellActionsProps> = ({ data }) => {
  const [openDelete, setOpenDelete] = useState(false);
  const editDocumentTypeModal = useEditDocumentTypeModal();
  const { handleDeleteDocumentType, isDeleteDocumentTypeLoading } =
    useDocumentTypes();
    
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.userType === ROLES.ADMIN;

  const onDelete = async () => {
    if (!isAdmin) return;
    try {
      await handleDeleteDocumentType(data.id || 0);
      setOpenDelete(false);
    } catch (error) {
      console.error("Error deleting document type:", error);
    }
  };

  return (
    <>
      {isAdmin && (
        <AlertModal
          isOpen={openDelete}
          onClose={() => setOpenDelete(false)}
          onConfirm={onDelete}
          loading={isDeleteDocumentTypeLoading}
        />
      )}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => editDocumentTypeModal.onOpen(data)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenDelete(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

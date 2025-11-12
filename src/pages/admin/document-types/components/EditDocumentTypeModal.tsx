import { Modal } from "../../../../common/ui/modal";
import { DocumentTypeFormValues } from "../../../../schema/admin/document-type";
import { useEditDocumentTypeModal } from "../../hooks/use-edit-document-type-modal";
import { useDocumentTypes } from "../../hooks/use-document-types";
import DocumentTypeForm from "./DocumentTypeForm";

export const EditDocumentTypeModal = () => {
  const { isOpen, onClose, documentType } = useEditDocumentTypeModal();
  const { handleUpdateDocumentType, isEditDocumentTypeLoading } =
    useDocumentTypes();

  const handleSubmit = async (data: DocumentTypeFormValues) => {
    try {
      if (documentType?.id) {
        await handleUpdateDocumentType({ ...data, id: documentType.id });
      }
    } catch (error) {
      console.error("Error updating document type:", error);
    }
  };

  const defaultValues: Partial<DocumentTypeFormValues> = {
    userTypes: documentType?.userTypes || [],
    name: documentType?.name || "",
    isActive: documentType?.isActive ?? true,
  };

  return (
    <Modal
      title="Edit Document Type"
      description="Update document type information"
      isOpen={isOpen}
      onClose={onClose}
      className="z-[101] w-full sm:w-[80%] lg:w-[50%] h-[90%] sm:h-[550px] mt-5 overflow-y-scroll"
    >
      <DocumentTypeForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={isEditDocumentTypeLoading}
        onClose={onClose}
        buttonTitle="Update"
      />
    </Modal>
  );
};

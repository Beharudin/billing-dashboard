import { Modal } from "../../../../common/ui/modal";
import { DocumentTypeFormValues } from "../../../../schema/admin/document-type";
import { useAddDocumentTypeModal } from "../../hooks/use-add-document-type-modal";
import { useDocumentTypes } from "../../hooks/use-document-types";
import DocumentTypeForm from "./DocumentTypeForm";

export const AddDocumentTypeModal = () => {
  const { isOpen, onClose } = useAddDocumentTypeModal();
  const { handleAddDocumentType, isAddDocumentTypeLoading } =
    useDocumentTypes();

  const handleSubmit = async (data: DocumentTypeFormValues) => {
    try {
      await handleAddDocumentType(data);
    } catch (error) {
      console.error("Error adding document type:", error);
    }
  };

  const defaultValues: Partial<DocumentTypeFormValues> = {
    userTypes: ["AGENT"],
    name: "",
    isActive: true,
  };

  return (
    <Modal
      title="Add New Document Type"
      description="Create a new document type"
      isOpen={isOpen}
      onClose={onClose}
      className="z-[101] w-full sm:w-[80%] lg:w-[50%] h-[90%] sm:h-[550px] mt-5 overflow-y-scroll"
    >
      <DocumentTypeForm
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        loading={isAddDocumentTypeLoading}
        onClose={onClose}
        buttonTitle="Create"
      />
    </Modal>
  );
};

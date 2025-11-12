import { create } from "zustand";
import { DocumentType } from "../../../constants/interface/admin/general";

interface useEditDocumentTypeModalStore {
  isOpen: boolean;
  documentType: DocumentType | null;
  onOpen: (documentType?: DocumentType | null) => void;
  onClose: () => void;
}

export const useEditDocumentTypeModal = create<useEditDocumentTypeModalStore>((set) => ({
  isOpen: false,
  documentType: null,
  onOpen: (documentType = null) => set({ isOpen: true, documentType }),
  onClose: () => set({ isOpen: false, documentType: null }),
}));
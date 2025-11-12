import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { DocumentTypeFormValues } from "../../../schema/admin/document-type";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

const fetchDocumentTypes = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/document-types`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch document types");
    throw new Error(errorData.message ?? "Failed to fetch document types");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useDocumentTypes = (options?: {
  isFetchDocumentTypes: boolean;
}) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: documentTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["document-types"],
    queryFn: () => fetchDocumentTypes(accessToken ?? ""),
    enabled: options?.isFetchDocumentTypes ?? false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const addDocumentTypeMutation = useMutation({
    mutationFn: async (data: DocumentTypeFormValues) => {
      const { id, ...rest } = data;
      console.log(rest);
      const res = await fetch(`${baseUrl}/document-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create document type");
        throw new Error(errorData.message ?? "Failed to create document type");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-types"] });
      toast.success("Document type created successfully");
    },
  });

  const editDocumentTypeMutation = useMutation({
    mutationFn: async (data: DocumentTypeFormValues & { id: number }) => {
      const { id, ...rest } = data;
      const res = await fetch(`${baseUrl}/document-types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(rest),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update document type");
        throw new Error(errorData.message ?? "Failed to update document type");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-types"] });
      toast.success("Document type updated successfully");
    },
  });

  const deleteDocumentTypeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${baseUrl}/document-types/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete document type");
        throw new Error(errorData.message ?? "Failed to delete document type");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["document-types"] });
      toast.success("Document type deleted successfully");
    },
  });

  return {
    documentTypes,
    isLoading,
    error,
    handleAddDocumentType: addDocumentTypeMutation.mutateAsync,
    handleEditDocumentType: editDocumentTypeMutation.mutateAsync,
    handleUpdateDocumentType: editDocumentTypeMutation.mutateAsync,
    isAddDocumentTypeLoading: addDocumentTypeMutation.isPending,
    isEditDocumentTypeLoading: editDocumentTypeMutation.isPending,
    addDocumentTypeError: addDocumentTypeMutation.error,
    editDocumentTypeError: editDocumentTypeMutation.error,
    handleDeleteDocumentType: deleteDocumentTypeMutation.mutateAsync,
    isDeleteDocumentTypeLoading: deleteDocumentTypeMutation.isPending,
    deleteDocumentTypeError: deleteDocumentTypeMutation.error,
  };
};

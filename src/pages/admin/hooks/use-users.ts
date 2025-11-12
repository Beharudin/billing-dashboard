import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserFormValues } from "../../../schema/admin/user";
import { RootState } from "../../../store";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

const fetchUsers = async (accessToken: string) => {
  const res = await fetch(`${baseUrl}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.message ?? "Failed to fetch users");
    throw new Error(errorData.message ?? "Failed to fetch users");
  }
  const data = await res.json();
  return data.data ?? [];
};

export const useUsers = (options?: { isFetchUsers: boolean }) => {
  const queryClient = useQueryClient();
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(accessToken ?? ""),
    enabled: options?.isFetchUsers,
  });

  const addUserMutation = useMutation({
    mutationFn: async (data: UserFormValues) => {
      const { id, ...rest } = data;
      const newData = {
        ...rest,
        userTypeId: rest.roleId,
      };

      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to create user");
        throw new Error(errorData.message ?? "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully");
    },
  });

  const editUserMutation = useMutation({
    mutationFn: async (data: UserFormValues & { id: number }) => {
      const { id, password, ...rest } = data;
      const newData = {
        ...rest,
        userTypeId: rest.roleId,
      };
      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to update user");
        throw new Error(errorData.message ?? "Failed to update user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${baseUrl}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message ?? "Failed to delete user");
        throw new Error(errorData.message ?? "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully");
    },
  });

  return {
    users,
    isLoading,
    error,
    handleAddUser: addUserMutation.mutateAsync,
    handleEditUser: editUserMutation.mutateAsync,
    handleUpdateUser: editUserMutation.mutateAsync,
    isAddUserLoading: addUserMutation.isPending,
    isEditUserLoading: editUserMutation.isPending,
    addUserError: addUserMutation.error,
    editUserError: editUserMutation.error,
    handleDeleteUser: deleteUserMutation.mutateAsync,
    isDeleteUserLoading: deleteUserMutation.isPending,
    deleteUserError: deleteUserMutation.error,
  };
};

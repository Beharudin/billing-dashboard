import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../common/ui/form";
import { Input } from "../../../../common/ui/input";
import { Loader } from "../../../../common/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../common/ui/select";
import { userFormSchema, UserFormValues } from "../../../../schema/admin/user";
import { useRoles } from "../../hooks/use-roles";

interface UserFormProps {
  defaultValues: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  loading: boolean;
  isEdit: boolean;
  onClose: () => void;
  buttonTitle: string;
}

const UserForm: React.FC<UserFormProps> = ({
  defaultValues,
  onSubmit,
  loading,
  isEdit,
  onClose,
  buttonTitle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });
  const { roles } = useRoles({ isFetchRoles: true });

  // Set default role to PARTNER_SUB_ADMIN only
  const defaultRole = roles?.find(
    (role: any) => role.name === "PARTNER_SUB_ADMIN"
  );

  const handleSubmit = async (data: UserFormValues) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username:</FormLabel>
                <FormControl>
                  <Input {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="hideIncrementor">
                <FormLabel>Phone Number:</FormLabel>
                <FormControl>
                  <Input type="number" {...field} disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="roleId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type:</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(defaultRole.id)}
                  disabled={true}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      key={defaultRole.id}
                      value={String(defaultRole.id)}
                    >
                      {defaultRole.name === "ADMIN"
                        ? "Admin"
                        : "Partner Sub-Admin"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEdit && (
            <div className="space-y-2 relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password:</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          disabled={loading}
                        />
                        <span
                          className="absolute right-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff height={20} />
                          ) : (
                            <Eye height={20} />
                          )}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="pt-6 space-x-2 flex items-center justify-center w-full">
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className={`bg-cyan-500 text-white hover:bg-cyan-500 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading && <Loader color="#ffffff" size={15} />} {buttonTitle}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;

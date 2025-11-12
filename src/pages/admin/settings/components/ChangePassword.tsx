import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Separator } from "../../../../common/ui/separator";

const formSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Password is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:"<>?~])/, {
        message:
          "Password must contain one lowercase letter, one uppercase letter, one number, and one special character",
      }),
    confirmPassword: z
      .string()
      .min(6, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.oldPassword !== data.password, {
    message: "New password must not match old password",
    path: ["password"],
  });

const ChangePassword = () => {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // const { handleChangePassword, isChangePasswordLoading, changePasswordError } =
  //   useSettings();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (_data: any) => {
    try {
      // await handleChangePassword(data);
      form.reset();
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-xl shadow-lg p-8 dark:bg-gray-900 dark:border-none">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Change Password
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Please enter your current password and choose a new one.
        </p>
        <Separator className="my-4" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="oldPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showOld ? "text" : "password"}
                        placeholder="Current password"
                        autoComplete="current-password"
                        {...field}
                        // disabled={isChangePasswordLoading}
                        className="pr-10 bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={() => setShowOld((v) => !v)}
                        tabIndex={-1}
                        aria-label={showOld ? "Hide password" : "Show password"}
                      >
                        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNew ? "text" : "password"}
                        placeholder="New password"
                        autoComplete="new-password"
                        {...field}
                        // disabled={isChangePasswordLoading}
                        className="pr-10 bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={() => setShowNew((v) => !v)}
                        tabIndex={-1}
                        aria-label={showNew ? "Hide password" : "Show password"}
                      >
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-800 dark:text-gray-200">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        {...field}
                        // disabled={isChangePasswordLoading}
                        className="pr-10 bg-white border border-gray-300 text-gray-900 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        onClick={() => setShowConfirm((v) => !v)}
                        tabIndex={-1}
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="submit"
                className="w-full"
                // disabled={isChangePasswordLoading}
              >
                {/* {isChangePasswordLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )} */}
                Change Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;

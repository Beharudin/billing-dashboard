import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff, Key, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UseMutateFunction } from "react-query";
import { Link } from "react-router-dom";
import { Button } from "../../common/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../common/ui/form";
import { Input } from "../../common/ui/input";
import { Loader } from "../../common/ui/loader";
import { ResetPasswordFormValues, resetPasswordSchema } from "../../schema/auth";

type ResetPasswordFormProps = {
  onSubmit: UseMutateFunction<
    unknown,
    AxiosError,
    { email: string; otp: string; newPassword: string },
    unknown
  >;
  loading: boolean;
};

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit, loading }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (data: ResetPasswordFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full"
      >
        <div className="space-y-4 md:space-y-4">
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input type="email" disabled={loading} {...field} />
                      <span className="absolute right-3">
                        <Mail size={20} className="text-gray-400" />
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP Code:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input type="text" disabled={loading} {...field} />
                      <span className="absolute right-3">
                        <Key size={20} className="text-gray-400" />
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 relative">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                        disabled={loading}
                      />
                      <span
                        className="absolute right-10"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
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

          <div className="space-y-2 relative">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password:</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        disabled={loading}
                      />
                      <span
                        className="absolute right-10"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
          
          <Button
            disabled={loading}
            type="submit"
            className={`w-full text-white bg-cyan-500 hover:bg-cyan-600 ${
              loading ? "cursor-not-allowed" : ""
            }`}
          >
            {loading && (
              <span className="mr-2">
                <Loader color="#ffffff" size={15} />
              </span>
            )}
            Reset Password
          </Button>
          
          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-cyan-500 hover:underline dark:text-cyan-500"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </form>
    </Form>
  );
};
import React from "react";
import { ShieldCheck } from "lucide-react";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { useAuth } from "../../hooks/use-auth";

const ResetPassword: React.FC = () => {
  const { handleResetPassword, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-100">
            <ShieldCheck className="h-6 w-6 text-cyan-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email, OTP code, and new password to reset your account
          </p>
        </div>

        <div className="bg-white px-6 py-8 shadow sm:rounded-lg sm:px-10">
          <ResetPasswordForm onSubmit={handleResetPassword} loading={loading} />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Make sure to check your email for the OTP code sent to you
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

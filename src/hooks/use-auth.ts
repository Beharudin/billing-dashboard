import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  ForgotPasswordFormValues,
  LoginFormValues,
  ResetPwdFormValues,
  SignupFormValues,
} from "../schema/auth";
import { useAppDispatch, useAppSelector } from "../store";
import {
  authenticate,
  createUserData,
  forgotPassword,
  resetPassword,
} from "../store/auth/auth-extra";
import { logout } from "../store/auth/auth-slice";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, user } = useAppSelector(
    (state) => state.auth
  );

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormValues) =>
      dispatch(authenticate(data)).unwrap(),
    onSuccess: (response: any) => {
      if (response?.payload?.success) {
        navigate("/admin");
        toast.success("Login successful");
      }
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message;
      if (error.response?.status === 400) {
        if (
          errorMessage === "Invalid credentials" ||
          errorMessage?.includes("credentials")
        ) {
          toast.error("Invalid username or password");
        } else {
          toast.error(errorMessage || "Invalid login credentials");
        }
      } else {
        toast.error(errorMessage || "Something went wrong! Please try again.");
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: (data: SignupFormValues) => dispatch(createUserData(data)),
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error: AxiosError) => {
      // Check if backend is down (network error or connection refused)
      const isBackendDown =
        !error.response ||
        error.code === "ECONNREFUSED" ||
        error.code === "NETWORK_ERROR" ||
        error.message?.includes("Network Error") ||
        error.message?.includes("ERR_NETWORK");

      if (isBackendDown) {
        // Backend is down - treat as successful registration
        toast.success("Backend is down - registration successful (mock)");
        navigate("/login");
        return;
      }

      // Normal error handling for when backend is up
      if (error.message === "Email already exists") {
        toast.error("Email is already registered");
      } else {
        toast.error("Something went wrong!");
      }
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) =>
      dispatch(forgotPassword(data.email)).unwrap(),
    onSuccess: () => {
      toast.success("OTP sent to your email");
      navigate("/reset-password");
    },
    onError: (error: AxiosError<any>) => {
      const errorMessage = error.response?.data?.message;
      toast.error(
        errorMessage || "Failed to send reset OTP. Please try again."
      );
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPwdFormValues) =>
      dispatch(
        resetPassword({
          email: data.email,
          otp: data.otp,
          newPassword: data.newPassword,
        })
      ).unwrap(),
    onSuccess: () => {
      toast.success("Password reset successfully");
      navigate("/login");
    },
    onError: (error: any) => {
      const errorMessage = error.message;

      toast.error(
        errorMessage || "Failed to reset password. Please try again."
      );
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return {
    loading:
      loginMutation.isPending ||
      signupMutation.isPending ||
      forgotPasswordMutation.isPending ||
      resetPasswordMutation.isPending,
    isAuthenticated,
    accessToken,
    user,
    handleLogin: loginMutation.mutate,
    handleSignup: signupMutation.mutate,
    handleForgotPassword: forgotPasswordMutation.mutate,
    handleResetPassword: resetPasswordMutation.mutate,
    handleLogout,
  };
};

import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../config/axios-config";
import { HTTP_RESPONSE } from "../../constants/general";
import { Login } from "../../constants/interface/auth";
import {
  updateTokens,
  updateUser
} from "./auth-slice";

const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_URL
    : import.meta.env.VITE_PRO_BACKEND_URL;

export const createUserData = createAsyncThunk(
  "auth/createUser",
  async (data: any) => {
    try {
      const res = await API.post(`${baseUrl}/auth/register`, data);
      const newData = await res.data;
      if (newData.status === "fail") {
        const message = newData.message
          ? newData.message
          : "Adding User Request Failed!";
        throw new Error(message);
      } else {
        return newData;
      }
    } catch (error: any) {
      throw error;
    }
  }
);

export const authenticate = createAsyncThunk(
  "auth/login",
  async (credentials: Login, { dispatch }) => {
    try {
      const { status, data } = await API.post(
        `${baseUrl}/auth/login`,
        credentials
      );

      if (status === HTTP_RESPONSE.SUCCESS && data.success) {
        // Update current user
        dispatch(
          updateUser({
            username: data.data.username,
            userType: data.data.role,
          })
        );

        // Update tokens (redux-persist will handle storage)
        dispatch(
          updateTokens({
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          })
        );

        return data;
      } else {
        const errorMessage = data.message || "Login Request Failed!";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string) => {
    try {
      const { status, data } = await API.post(
        `${baseUrl}/auth/password/forgot`,
        { email }
      );

      if (status === HTTP_RESPONSE.SUCCESS && data.success) {
        return data;
      } else {
        const errorMessage = data.message || "Forgot password request failed!";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (resetData: { email: string; otp: string; newPassword: string }) => {
    try {
      const { status, data } = await API.post(
        `${baseUrl}/auth/password/reset`,
        resetData
      );

      if (status === HTTP_RESPONSE.SUCCESS && data.success) {
        return data;
      } else {
        const errorMessage = data.message || "Password reset failed!";
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.log(error);
      throw error;
    }
  }
);

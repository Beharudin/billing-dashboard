// import axios from 'axios';
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { Dispatch } from "redux";
import { notifications } from "../../common/data/data";
import API from "../../config/axios-config";
import { fetchNotifications, updateNotifications } from "./notification-slice";

export const fetchNotificationsData = createAsyncThunk(
  "users/getusers",
  async (_, { dispatch }) => {
    try {
      // const { data } = await API.get('admin/notification/getall');
      // if (data) {
      //   dispatch(fetchNotifications(data));
      // }
      dispatch(fetchNotifications(notifications));
      // return data ?? [];
      return notifications ?? [];
    } catch (error: any) {
      toast.error("Something went wrong!");
    }
  }
);

export const updateNotificationStatus = (id: string) => {
  return async (dispatch: Dispatch) => {
    try {
      // const response = await API.patch(`admin/notification/update/${id}`);
      const { status } = await API.patch(`/admin`);

      if (status === 200) {
        dispatch(updateNotifications(id));
      }
    } catch (error: any) {
      toast.error("Something went wrong!");
    }
  };
};

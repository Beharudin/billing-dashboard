import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../constants/interface/auth";
import { authInitialState } from "../initialStates";

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {
    updateUser(state, { payload }: PayloadAction<User | undefined>) {
      state.user = payload;
    },
    updateTokens(
      state,
      { payload }: PayloadAction<{ accessToken: string; refreshToken?: string }>
    ) {
      state.accessToken = payload.accessToken;
      state.refreshToken = payload.refreshToken;
      state.isAuthenticated = true;
    },
    
    logout(state) {
      state.user = undefined;
      state.accessToken = undefined;
      state.refreshToken = undefined;
      state.isAuthenticated = false;
    },
  },
});

export const {
  updateUser,
  updateTokens,
  logout,
} = authSlice.actions;
export default authSlice.reducer;

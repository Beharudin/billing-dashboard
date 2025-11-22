// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/store/billing/billing-extra.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { setPlans, setSubscription } from "./billing-slice";
import plans from "../../common/data/plans.json";
import { mockUsers } from "../../common/data/data";

export const fetchBillingData = createAsyncThunk(
  "billing/init",
  async (_, { dispatch, getState }) => {
    dispatch(setPlans(plans as any));
    const state = getState() as RootState;
    const username = state.auth.user?.username;
    let sub = undefined;
    if (username) {
      const u = mockUsers.find((m) => m.username === username);
      sub = (u as any)?.subscription;
    }
    dispatch(setSubscription(sub));
    return { plans, subscription: sub };
  }
);
// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/store/billing/billing-slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Subscription, Plan } from "../../constants/interface/admin/user";

interface BillingState {
  plans: Plan[];
  subscription?: Subscription;
}

const initialState: BillingState = {
  plans: [],
  subscription: undefined,
};

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    setPlans(state, action: PayloadAction<Plan[]>) {
      state.plans = action.payload;
    },
    setSubscription(state, action: PayloadAction<Subscription | undefined>) {
      state.subscription = action.payload;
    },
    changePlan(state, action: PayloadAction<string>) {
      const planKey = action.payload;
      const start = new Date().toISOString();
      const interval =
        state.plans.find((p) => p.key === planKey)?.interval || "month";
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + (interval === "month" ? 30 : 365));
      state.subscription = { planKey, start, end: endDate.toISOString() };
    },
    cancelSubscription(state) {
      state.subscription = undefined;
    },
  },
});

export const { setPlans, setSubscription, changePlan, cancelSubscription } =
  billingSlice.actions;
export default billingSlice.reducer;
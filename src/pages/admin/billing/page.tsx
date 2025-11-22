// c:/Users/Coop/Documents/ReactProjects/billing-dashboard/src/pages/admin/billing/page.tsx
import { useEffect, useMemo, useState } from "react";
import { Check, Crown, CalendarDays, CreditCard } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { fetchBillingData } from "../../../store/billing/billing-extra";
import { changePlan, cancelSubscription } from "../../../store/billing/billing-slice";

const BillingPage = () => {
  const dispatch = useAppDispatch();
  const { plans, subscription } = useAppSelector((s) => s.billing);
  const [interval, setInterval] = useState<"month" | "year">(
    subscription?.planKey?.includes("year") ? "year" : "month"
  );

  useEffect(() => {
    if (!plans.length) {
      dispatch(fetchBillingData());
    }
  }, []);

  const currentPlan = useMemo(() => plans.find((p) => p.key === subscription?.planKey), [plans, subscription]);
  const daysLeft = useMemo(() => {
    if (!subscription?.end) return undefined;
    const end = new Date(subscription.end).getTime();
    const diff = Math.max(0, Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24)));
    return diff;
  }, [subscription]);

  const visiblePlans = useMemo(() => plans.filter((p) => p.interval === interval), [plans, interval]);
  const tierFromKey = (key?: string) => (key?.startsWith("pro") ? "pro" : "basic");
  const currentTier = tierFromKey(subscription?.planKey);

  const features = {
    basic: ["Dashboard", "Document Types", "Inventory"],
    pro: ["Everything in Basic", "Users", "Logs", "Advanced Reports", "Analytics"],
  } as const;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Billing</h2>
          <p className="text-sm text-gray-600">Manage your subscription and access to premium features</p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
          onClick={() => dispatch(cancelSubscription())}
        >
          <CreditCard size={16} /> Cancel Subscription
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 rounded-md border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Crown className="text-amber-500" size={18} />
            <div className="font-medium">Current Plan</div>
          </div>
          <div className="text-sm">
            {currentPlan ? `${currentPlan.name} • ${currentPlan.price}/${currentPlan.interval}` : "None"}
          </div>
          {subscription && (
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2"><CalendarDays size={16} /> Start: {new Date(subscription.start).toLocaleDateString()}</div>
              <div className="flex items-center gap-2"><CalendarDays size={16} /> Ends: {new Date(subscription.end).toLocaleDateString()}</div>
              {typeof daysLeft === "number" && <div className="text-xs text-gray-500">{daysLeft} days remaining</div>}
            </div>
          )}
        </div>

        <div className="md:col-span-2 rounded-md border p-5">
          <div className="flex items-center justify-between">
            <div className="font-medium">Choose a plan</div>
            <div className="inline-flex rounded-md border p-1 text-sm">
              <button
                className={"px-3 py-1 rounded " + (interval === "month" ? "bg-gray-900 text-white" : "")}
                onClick={() => setInterval("month")}
              >
                Monthly
              </button>
              <button
                className={"px-3 py-1 rounded " + (interval === "year" ? "bg-gray-900 text-white" : "")}
                onClick={() => setInterval("year")}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {visiblePlans.map((p) => {
              const tier = tierFromKey(p.key);
              const isCurrent = p.key === subscription?.planKey;
              const isUpgrade = currentTier === "basic" && tier === "pro";
              const isDowngrade = currentTier === "pro" && tier === "basic";
              return (
                <div key={p.key} className={"rounded-md border p-5 space-y-3 " + (tier === "pro" ? "border-amber-400" : "")}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{p.name}</div>
                    {tier === "pro" && <span className="text-xs rounded bg-amber-100 text-amber-700 px-2 py-0.5">Recommended</span>}
                  </div>
                  <div className="text-2xl font-bold">${p.price}<span className="text-sm font-normal">/{p.interval}</span></div>
                  <ul className="space-y-2 text-sm">
                    {(features as any)[tier].map((f: string) => (
                      <li key={f} className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> {f}</li>
                    ))}
                  </ul>
                  <button
                    disabled={isCurrent}
                    className={"w-full inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm " + (isCurrent ? "opacity-60 cursor-not-allowed" : "")}
                    onClick={() => dispatch(changePlan(p.key))}
                  >
                    {isCurrent ? "Current Plan" : isUpgrade ? "Upgrade" : isDowngrade ? "Downgrade" : "Select"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
import { FileText, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../common/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../common/ui/card";
import { Loader } from "../../../../common/ui/loader";
import InfoField from "../../components/InfoField";
import { useTinRegistration } from "../../hooks/use-tin-registration";
import { StatusBadge } from "../../../../common/ui/status-badge";

interface TinDetailsCardProps {
  tin: string;
  agentName?: string;
}

interface RegistrationInfo {
  BusinessName?: string;
  RegNo?: string;
  Tin?: string;
  AssociateShortInfos?: Array<{
    MobilePhone?: string;
    RegularPhone?: string;
  }>;
  Businesses?: Array<any>;
}

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Helper to clean description that already embeds the code like "(62115)Small shop (Kiosk)"
const cleanSubGroupDescription = (desc?: string, code?: string | number) => {
  if (!desc) return "";
  let cleaned = String(desc);
  if (code !== undefined && code !== null) {
    const codeStr = String(code).replace(/\s+/g, "");
    const pattern = new RegExp(`^\\(\\s*${codeStr}\\s*\\)\\s*`);
    cleaned = cleaned.replace(pattern, "");
  } else {
    cleaned = cleaned.replace(/^\(\s*\d+\s*\)\s*/, "");
  }
  return cleaned.trim();
};

const renderSubGroups = (subGroups: any) => {
  if (!subGroups) return "N/A";

  // Collect items as normalized strings first
  let items: string[] = [];

  if (Array.isArray(subGroups)) {
    items = subGroups
      .filter((item) => item != null)
      .map((item: any) => {
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          const code = item.Code ?? item.code;
          const raw = item.Description ?? item.description ?? item.name;
          const desc = cleanSubGroupDescription(raw, code);
          if (code && desc) return `${code}: ${desc}`;
          return desc || String(code ?? "").trim() || "Unknown";
        }
        return String(item);
      })
      .filter(Boolean);
  } else if (typeof subGroups === "string") {
    items = [subGroups];
  } else if (typeof subGroups === "object") {
    items = Object.values(subGroups)
      .filter((v) => v != null)
      .map((v: any) => {
        if (typeof v === "string") return v;
        if (typeof v === "object") {
          const code = v.Code ?? v.code;
          const raw = v.Description ?? v.description ?? v.name;
          const desc = cleanSubGroupDescription(raw, code);
          if (code && desc) return `${code}: ${desc}`;
          return desc || String(code ?? "").trim() || "Unknown";
        }
        return String(v);
      })
      .filter(Boolean);
  }

  if (!items.length) return "N/A";

  // Render line-by-line (stacked vertically)
  return (
    <div className="flex flex-col gap-1">
      {items.map((text, idx) => (
        <div key={idx} className="whitespace-pre-line">
          {text}
        </div>
      ))}
    </div>
  );
};

const TinDetailsCard: React.FC<TinDetailsCardProps> = ({ tin, agentName }) => {
  const { fetchRegistrationInfo, isFetchingRegistrationInfo } =
    useTinRegistration();
  const [registrationInfo, setRegistrationInfo] =
    useState<RegistrationInfo | null>(null);
  const [serviceUnavailable, setServiceUnavailable] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const loadTinInfo = async () => {
    if (!tin) return;
    try {
      const res = await fetchRegistrationInfo(tin);
      const info: RegistrationInfo | undefined = res?.data?.registrationInfo;
      setRegistrationInfo(info ?? null);
      setServiceUnavailable(false);
      setLastRefreshedAt(new Date());
    } catch (error: any) {
      if (error?.message === "SERVICE_UNAVAILABLE") {
        setServiceUnavailable(true);
      }
    }
  };

  useEffect(() => {
    loadTinInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tin]);

  const managerInfo = registrationInfo?.AssociateShortInfos?.[0];
  const businessInfo = registrationInfo?.Businesses?.[0];
  const renewedTo = businessInfo?.RenewedTo as string | undefined;
  const isLicenseActive = renewedTo ? new Date(renewedTo) >= new Date() : null;
  const isInitialLoading = isFetchingRegistrationInfo && !registrationInfo;

  return (
    <Card className="dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
            <FileText className="w-5 h-5" />
            <span>TIN Registry</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastRefreshedAt && (
              <span className="text-xs text-gray-500 dark:text-slate-400">
                Last refreshed: {lastRefreshedAt.toLocaleString()}
              </span>
            )}
            <Button
              type="button"
              onClick={loadTinInfo}
              disabled={isFetchingRegistrationInfo || !tin}
              className="bg-cyan-500 hover:bg-cyan-500 text-white"
              size="sm"
            >
              {isFetchingRegistrationInfo ? (
                <>
                  <Loader color="#ffffff" size={15} />
                  <span className="ml-2">Refreshing...</span>
                </>
              ) : (
                <>
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!tin ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-slate-400">
              TIN not available for this agent.
            </p>
          </div>
        ) : serviceUnavailable ? (
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 text-orange-700 dark:text-orange-300">
            External business registry service is currently unavailable. Please
            try again later.
          </div>
        ) : (
          <>
            {/* Loading state */}
            {isFetchingRegistrationInfo && (
              <div className="flex items-center justify-center py-6">
                <Loader color="#3b82f6" size={24} />
              </div>
            )}

            {/* Summary section */}
            {registrationInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <InfoField
                    label="Agent"
                    value={agentName || registrationInfo.BusinessName || "N/A"}
                  />
                  <InfoField
                    label="Registration Number"
                    value={registrationInfo.RegNo || "N/A"}
                  />
                  <InfoField label="TIN" value={registrationInfo.Tin || tin} />
                </div>
                <div className="space-y-4">
                  <InfoField
                    label="Contact Phone"
                    value={
                      managerInfo?.MobilePhone ||
                      managerInfo?.RegularPhone ||
                      "N/A"
                    }
                  />
                  <InfoField
                    label="License Status"
                    value={
                      isLicenseActive === null ? (
                        "Unknown"
                      ) : (
                        <StatusBadge
                          status={isLicenseActive ? "ACTIVE" : "INACTIVE"}
                          showIcon={true}
                        />
                      )
                    }
                  />
                  {renewedTo && (
                    <InfoField
                      label="License Valid To"
                      value={formatDate(renewedTo)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Businesses section */}
            {!isInitialLoading && (
              <div className="dark:text-slate-100">
                <h3 className="text-lg font-semibold mb-3">Businesses</h3>
                {registrationInfo?.Businesses &&
                registrationInfo.Businesses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-slate-600">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            Trade Name
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            License No.
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            Date Registered
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            Renewed From
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            Renewed To
                          </th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">
                            Sub Groups
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrationInfo.Businesses.map(
                          (biz: any, index: number) => (
                            <tr
                              key={index}
                              className={`border-b border-gray-100 dark:border-slate-700 ${
                                index % 2 === 0
                                  ? "bg-gray-50 dark:bg-slate-800/50"
                                  : "bg-white dark:bg-slate-800"
                              }`}
                            >
                              <td className="py-3 px-4 text-gray-900 dark:text-slate-100">
                                {biz.TradesName || "N/A"}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                                {biz.LicenceNumber || "N/A"}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                                {formatDate(biz.DateRegistered)}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                                {formatDate(biz.RenewedFrom)}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                                {formatDate(biz.RenewedTo)}
                              </td>
                              <td className="py-3 px-4 text-gray-600 dark:text-slate-300">
                                {renderSubGroups(biz.SubGroups)}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-slate-400">
                    No business entries found.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TinDetailsCard;

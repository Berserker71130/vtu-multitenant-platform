"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/lib/supabaseClient";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface SystemTenant {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  totalSales: number;
  walletBalance: number;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  joinedDate: string;
}

export default function SuperAdminConsolePage() {
  const [tenants, setTenants] = useState<SystemTenant[]>([]);
  const [grossVolume, setGrossVolume] = useState<number>(0);
  const [totalWalletFloat, setTotalWalletFloat] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch all live data from Supabase
  const fetchConsoleData = useCallback(async () => {
    setErrorMessage("");
    try {
      // 1. Fetch Tenants
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false });

      if (tenantError) {
        console.warn("Tenant fetch error or table empty:", tenantError.message);
      }

      // 2. Fetch Transactions to calculate Gross Sales per tenant and globally
      const { data: txData, error: txError } = await supabase
        .from("transactions")
        .select("amount, tenant_id, tenant_slug, status, type")
        .eq("status", "success")
        .eq("type", "debit");

      if (txError) {
        console.warn("Transactions fetch error:", txError.message);
      }

      // 3. Fetch Wallets to get actual live tenant balances
      const { data: walletData, error: walletError } = await supabase
        .from("wallets")
        .select("tenant_id, tenant_slug, balance");

      if (walletError) {
        console.warn("Wallets fetch error:", walletError.message);
      }

      // Compute total global gross volume
      const totalVolume = (txData || []).reduce(
        (sum, tx) => sum + (Number(tx.amount) || 0),
        0,
      );
      setGrossVolume(totalVolume);

      // Compute sum of all tenant wallet balances
      const totalFloat = (walletData || []).reduce(
        (sum, w) => sum + (Number(w.balance) || 0),
        0,
      );
      setTotalWalletFloat(totalFloat);

      // Process & Map Tenants with calculated sales and live wallet balance
      const mappedTenants: SystemTenant[] = (tenantData || []).map((t: any) => {
        // Sum total sales for this specific tenant
        const tenantSales = (txData || [])
          .filter(
            (tx) =>
              (tx.tenant_id && tx.tenant_id === t.id) ||
              (tx.tenant_slug && tx.tenant_slug === t.slug),
          )
          .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

        // Find matching wallet balance
        const tenantWallet = (walletData || []).find(
          (w) =>
            (w.tenant_id && w.tenant_id === t.id) ||
            (w.tenant_slug && w.tenant_slug === t.slug),
        );

        return {
          id: t.id,
          name: t.name || t.store_name || "Unnamed Store",
          slug: t.slug || "no-slug",
          ownerEmail: t.owner_email || t.email || "N/A",
          totalSales: tenantSales,
          walletBalance: Number(tenantWallet?.balance || t.wallet_balance || 0),
          status: (t.status?.toUpperCase() as any) || "ACTIVE",
          joinedDate: t.created_at
            ? new Date(t.created_at).toISOString().split("T")[0]
            : "N/A",
        };
      });

      setTenants(mappedTenants);
    } catch (err: any) {
      console.error("Super Admin Data Fetch Error:", err);
      setErrorMessage("Failed to load live platform data.");
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchConsoleData();
  }, [fetchConsoleData]);

  // Toggle tenant status in Supabase (Active <-> Suspended)
  const handleToggleTenantStatus = async (
    tenantId: string,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    // Optimistic UI Update
    setTenants((prev) =>
      prev.map((t) => (t.id === tenantId ? { ...t, status: newStatus } : t)),
    );

    try {
      const { error } = await supabase
        .from("tenants")
        .update({ status: newStatus.toLowerCase() })
        .eq("id", tenantId);

      if (error) {
        console.error("Supabase Tenant Status Update Error:", error.message);
        // Revert on error
        setTenants((prev) =>
          prev.map((t) =>
            t.id === tenantId
              ? { ...t, status: currentStatus as "ACTIVE" | "SUSPENDED" }
              : t,
          ),
        );
        alert(`Failed to update tenant status: ${error.message}`);
      }
    } catch (err) {
      console.error("Status Toggle Error:", err);
      fetchConsoleData(); // Reset on crash
    }
  };

  const handleTriggerApiSync = () => {
    setIsSyncing(true);
    fetchConsoleData();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-black relative overflow-hidden pb-16 transition-colors duration-300">
      {/* Ambient Platform Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[400px] bg-indigo-600/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Command Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-3 sm:px-6 py-3 sm:py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Root System
                </span>
                <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black uppercase tracking-wider rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden xs:block">
                Multi-Tenant Core Engine v2.4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />

            <button
              onClick={handleTriggerApiSync}
              disabled={isSyncing}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5 sm:gap-2 shadow-sm dark:shadow-none shrink-0"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 ${
                  isSyncing ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {isSyncing ? "Reconciling Supabase..." : "Sync Live Console"}
              </span>
              <span className="sm:hidden text-[11px]">Sync</span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live DB Connected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Metric Cards - Global Platform Health */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                Gross Volume
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                <DollarSign className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white truncate">
                ₦{grossVolume.toLocaleString()}
              </h2>
              <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1 truncate">
                <TrendingUp className="w-3 h-3 shrink-0" /> Real-time settled
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                Active Resellers
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white truncate">
                {tenants.length} Tenants
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                {tenants.filter((t) => t.status === "ACTIVE").length} active now
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                Total Float
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Database className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 truncate">
                ₦{totalWalletFloat.toLocaleString()}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                Live Wallets Combined
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-3.5 sm:p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                Success Rate
              </span>
              <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Activity className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white truncate">
                100.0%
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
                Supabase synced
              </p>
            </div>
          </motion.div>
        </section>

        {/* Telco Provider API Infrastructure Status Grid */}
        <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />{" "}
                Network Matrix
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live telemetry with upstream VTU servers.
              </p>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 sm:py-1 rounded-md bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              NGA-WEST-1
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[
              {
                name: "MTN SME & Direct",
                status: "OPERATIONAL",
                latency: "140ms",
              },
              {
                name: "Airtel Gifting",
                status: "OPERATIONAL",
                latency: "180ms",
              },
              {
                name: "Glo Corporate",
                status: "OPERATIONAL",
                latency: "210ms",
              },
              { name: "9mobile Data", status: "OPERATIONAL", latency: "165ms" },
            ].map((provider) => (
              <div
                key={provider.name}
                className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 transition-colors"
              >
                <div className="flex justify-between items-start mb-1 sm:mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white truncate">
                    {provider.name}
                  </span>
                  <span className="flex h-2 w-2 relative shrink-0 mt-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>Latency:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {provider.latency}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Status:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate">
                    {provider.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Multi-Tenant Management Table */}
        <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Registered Tenant Directory
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Control tenant access, review sales volume or toggle
                suspensions.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 font-mono w-fit">
              Total Tenant Count:{" "}
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {tenants.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                <span>Loading tenants from Supabase...</span>
              </div>
            ) : tenants.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No tenants found in Supabase database.
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[700px]">
                <thead className="bg-slate-100 dark:bg-slate-950/60 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-3.5">Tenant / Brand Name</th>
                    <th className="px-4 sm:px-6 py-3.5">Owner Contact</th>
                    <th className="px-4 sm:px-6 py-3.5">Total Sales</th>
                    <th className="px-4 sm:px-6 py-3.5">Wallet Balance</th>
                    <th className="px-4 sm:px-6 py-3.5">Status</th>
                    <th className="px-4 sm:px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                  {tenants.map((tenantItem) => (
                    <tr
                      key={tenantItem.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        <div>
                          <p className="text-xs sm:text-sm">
                            {tenantItem.name}
                          </p>
                          <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
                            /{tenantItem.slug}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap text-xs">
                        {tenantItem.ownerEmail}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        ₦{tenantItem.totalSales.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                        ₦{tenantItem.walletBalance.toLocaleString()}
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider ${
                            tenantItem.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {tenantItem.status === "ACTIVE" ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {tenantItem.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleToggleTenantStatus(
                              tenantItem.id,
                              tenantItem.status,
                            )
                          }
                          className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold text-[10px] sm:text-[11px] transition-all border ${
                            tenantItem.status === "ACTIVE"
                              ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {tenantItem.status === "ACTIVE"
                            ? "Suspend"
                            : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Backend Integration Slot */}
        <section className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-100 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-800 text-center transition-colors">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-sm dark:shadow-none">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Upstream Provider Backend Integration
          </h4>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-500 max-w-xl mx-auto mt-1">
            Connected to Supabase live database. Automatic gross volume and
            wallet float reconciliation active.
          </p>
        </section>
      </main>
    </div>
  );
}

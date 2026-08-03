"use client";

import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  DollarSign,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";

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

const INITIAL_TENANTS: SystemTenant[] = [
  {
    id: "t-1",
    name: "Apex Telecome",
    slug: "apex-telecom",
    ownerEmail: "admin@apex.ng",
    totalSales: 8450000,
    walletBalance: 48500,
    status: "ACTIVE",
    joinedDate: "2026-01-12",
  },
  {
    id: "t-2",
    name: "PowerConnect VTU",
    slug: "power-connect",
    ownerEmail: "ops@powerconnect.com",
    totalSales: 3200000,
    walletBalance: 12100,
    status: "ACTIVE",
    joinedDate: "2026-02-01",
  },
  {
    id: "t-3",
    name: "SwiftSub Direct",
    slug: "swiftsub",
    ownerEmail: "hello@swiftsub.ng",
    totalSales: 1120000,
    walletBalance: 2500,
    status: "ACTIVE",
    joinedDate: "2026-03-15",
  },
  {
    id: "t-4",
    name: "Kano Data Hub",
    slug: "kano-data",
    ownerEmail: "support@kanodata.ng",
    totalSales: 0,
    walletBalance: 0,
    status: "SUSPENDED",
    joinedDate: "2026-04-02",
  },
];

export default function SuperAdminConsolePage() {
  const [tenants, setTenants] = useState<SystemTenant[]>(INITIAL_TENANTS);
  const [isSyncing, setIsSyncing] = useState(false);

  // Toggle tenant status (Active <-> Suspended)
  const handleToggleTenantStatus = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === tenantId
          ? { ...t, status: t.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : t,
      ),
    );
  };

  const handleTriggerApiSync = () => {
    setIsSyncing(true);
    // API PLACEHOLDER: Trigger platform-wide provider gateway reconciliation
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-cyan-500 selection:text-black relative overflow-hidden pb-16 transition-colors duration-300">
      {/* Ambient Platform Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-[800px] h-[400px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-0 w-[600px] h-[400px] bg-indigo-600/5 blur-3xl pointer-events-none -z-10" />

      {/* Top Futuristic Command Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Root System Control
                </span>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Super Admin
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Multi-Tenant Core Engine v2.4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={handleTriggerApiSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 shadow-sm dark:shadow-none"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>
                {isSyncing ? "Reconciling APIs..." : "Sync Gateway Balance"}
              </span>
            </button>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Nominal</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Metric Cards - Global Platform Health */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Global Gross Volume
              </span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ₦12,770,000
            </h2>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last month
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Resellers
              </span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              24 Tenants
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              3 pending verification requests
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Master Provider Balance
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ₦1,850,400
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              Automated API float across 4 telcos
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl backdrop-blur-md relative overflow-hidden transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Platform Success Rate
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              99.82%
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
              Sub-second VTU API dispatch latency
            </p>
          </motion.div>
        </section>

        {/* Telco Provider API Infrastructure Status Grid */}
        <section className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 backdrop-blur-xl shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />{" "}
                Network Provider Integration Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Live connection telemetry with upstream VTU servers.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              API REGION: NGA-WEST-1
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "MTN SME & Direct",
                status: "OPERATIONAL",
                latency: "140ms",
                float: "₦850,000",
              },
              {
                name: "Airtel Gifting",
                status: "OPERATIONAL",
                latency: "180ms",
                float: "₦420,000",
              },
              {
                name: "Glo Corporate",
                status: "OPERATIONAL",
                latency: "210ms",
                float: "₦380,000",
              },
              {
                name: "9mobile Data",
                status: "OPERATIONAL",
                latency: "165ms",
                float: "₦200,400",
              },
            ].map((provider) => (
              <div
                key={provider.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {provider.name}
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-3">
                  <span>API Latency:</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {provider.latency}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Provider Float:</span>
                  <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">
                    {provider.float}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Global Multi-Tenant Management Table */}
        <section className="rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Registered Tenant Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Control tenant access, review sales volume or toggle
                suspensions.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono">
              Total Tenant Count:{" "}
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                {tenants.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[750px]">
              <thead className="bg-slate-100 dark:bg-slate-950/60 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tenant / Brand Name</th>
                  <th className="px-6 py-4">Owner Contact</th>
                  <th className="px-6 py-4">Total Sales</th>
                  <th className="px-6 py-4">Wallet Balance</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
                {tenants.map((tenantItem) => (
                  <tr
                    key={tenantItem.id}
                    className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      <div>
                        <p className="text-sm">{tenantItem.name}</p>
                        <p className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
                          /{tenantItem.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                      {tenantItem.ownerEmail}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      ₦{tenantItem.totalSales.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      ₦{tenantItem.walletBalance.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
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
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleToggleTenantStatus(tenantItem.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all border ${
                          tenantItem.status === "ACTIVE"
                            ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        }`}
                      >
                        {tenantItem.status === "ACTIVE"
                          ? "Suspend Tenant"
                          : "Activate Tenant"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Backend API Integration Slot Reserved */}
        <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/30 border border-dashed border-slate-300 dark:border-slate-800 text-center transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-sm dark:shadow-none">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Reserved Slot: Upstream Provider Backend API Wiring
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xl mx-auto mt-1">
            This module is structured for live webhooks, webhook signature
            verification, dynamic price matrix fetching and Paystack/Flutterwave
            secret key management.
          </p>
        </section>
      </main>
    </div>
  );
}

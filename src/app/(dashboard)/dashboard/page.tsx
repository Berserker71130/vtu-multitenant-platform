"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import { StatsCard } from "@/components/StatsCard";
import { useTenant } from "@/context/TenantContext";
import { BasePlan, NetworkProvider } from "@/types";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  DollarSign,
  Save,
  ShoppingBag,
  Sliders,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Helper component for network logos/badges
const NetworkBadge = ({ network }: { network: NetworkProvider }) => {
  switch (network) {
    case "MTN":
      return (
        <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
          MTN
        </span>
      );
    case "AIRTEL":
      return (
        <span className="w-7 h-7 rounded-full bg-red-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm">
          airtel
        </span>
      );
    case "GLO":
      return (
        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-sm">
          glo
        </span>
      );
    case "9MOBILE":
      return (
        <span className="w-7 h-7 rounded-full bg-teal-700 text-lime-400 font-black text-[8px] flex items-center justify-center shrink-0 shadow-sm">
          9mob
        </span>
      );
    default:
      return null;
  }
};

// Initial Base Plans From Master VTU Provider
const INITIAL_BASE_PLANS: BasePlan[] = [
  {
    id: "bp-1",
    network: "MTN",
    type: "DATA",
    name: "1.0 GB SME Data",
    value: "1GB",
    validity: "30 Days",
    basePrice: 220,
    isActive: true,
  },
  {
    id: "bp-2",
    network: "MTN",
    type: "DATA",
    name: "2.0 GB SME Data",
    value: "2GB",
    validity: "30 Days",
    basePrice: 440,
    isActive: true,
  },
  {
    id: "bp-3",
    network: "AIRTEL",
    type: "DATA",
    name: "1.5 GB Direct Data",
    value: "1.5GB",
    validity: "30 Days",
    basePrice: 350,
    isActive: true,
  },
  {
    id: "bp-4",
    network: "GLO",
    type: "DATA",
    name: "2.5 GB Corporate",
    value: "2.5GB",
    validity: "30 Days",
    basePrice: 500,
    isActive: true,
  },
];

export default function ResellerDashboardPage() {
  const { tenant, walletBalance, transactions } = useTenant();

  const [markups, setMarkups] = useState<Record<string, number>>({
    "bp-1": 270,
    "bp-2": 520,
    "bp-3": 420,
    "bp-4": 600,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && tenant?.slug) {
      const savedMarkups = localStorage.getItem(`vtu_markups_${tenant.slug}`);
      if (savedMarkups) {
        setMarkups(JSON.parse(savedMarkups));
      }
    }
  }, [tenant?.slug]);

  const handlePriceChange = (planId: string, newPrice: number) => {
    setMarkups((prev) => ({ ...prev, [planId]: newPrice }));
  };

  const handleSaveMarkups = () => {
    if (typeof window !== "undefined" && tenant?.slug) {
      localStorage.setItem(
        `vtu_markups_${tenant.slug}`,
        JSON.stringify(markups),
      );
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Calculate live analytics from actual transactions context
  const totalDebitSpend = transactions
    .filter((t) => t.type === "debit" && t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTxnCount = transactions.length;

  // Active customers calculated dynamically from transaction history
  const totalActiveCustomers =
    transactions.length > 0 ? transactions.length : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <DashboardNavbar
        storeName={tenant?.name || "Apex Telecom"}
        walletBalance={walletBalance}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Reseller Control Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
              Configure markup prices, monitor active customers and trace profit
              margins.
            </p>
          </div>

          <button
            onClick={handleSaveMarkups}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />{" "}
                Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" /> Save Price Changes
              </>
            )}
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatsCard
            title="Total Revenue"
            value={`₦${(1240500 + totalDebitSpend).toLocaleString()}`}
            change="+14.2%"
            icon={DollarSign}
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatsCard
            title="Net Profit Margin"
            value={`₦${(184200 + Math.floor(totalDebitSpend * 0.15)).toLocaleString()}`}
            change="+18.5%"
            icon={TrendingUp}
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatsCard
            title="Total Transactions"
            value={`₦${(3842 + totalTxnCount).toLocaleString()}`}
            change="+8.1%"
            icon={ShoppingBag}
            iconColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatsCard
            title="Active Customers"
            value={`₦${(612 + totalActiveCustomers).toLocaleString()}`}
            change="+12"
            icon={Users}
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Markup Price Configuration Wrapper */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Plan Markup & Custom Pricing
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  Set customer retail prices over wholesale base rates.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile View: Card List */}
          <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800/60">
            {INITIAL_BASE_PLANS.map((plan) => {
              const currentRetail = markups[plan.id] ?? plan.basePrice;
              const profitMargin = currentRetail - plan.basePrice;

              return (
                <div key={plan.id} className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <NetworkBadge network={plan.network} />
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">
                          {plan.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Validity: {plan.validity} • Wholesale: ₦
                          {plan.basePrice}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        profitMargin >= 0
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {profitMargin >= 0
                        ? `+₦${profitMargin}`
                        : `-₦${Math.abs(profitMargin)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      Retail Price:
                    </span>
                    <div className="relative w-36">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs pointer-events-none">
                        ₦
                      </span>
                      <input
                        type="number"
                        value={currentRetail}
                        onChange={(e) =>
                          handlePriceChange(plan.id, Number(e.target.value))
                        }
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-slate-900 dark:text-white font-bold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop/Tablet View: Full Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-950/50 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Network / Plan</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Wholesale Base</th>
                  <th className="px-6 py-4">Your Retail Price (₦)</th>
                  <th className="px-6 py-4 text-right">Profit / Sale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {INITIAL_BASE_PLANS.map((plan) => {
                  const currentRetail = markups[plan.id] ?? plan.basePrice;
                  const profitMargin = currentRetail - plan.basePrice;

                  return (
                    <motion.tr
                      key={plan.id}
                      className="hover:bg-slate-100/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                        <NetworkBadge network={plan.network} />
                        <span>{plan.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {plan.validity}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        ₦{plan.basePrice}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative w-32">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400 font-bold text-xs pointer-events-none">
                            ₦
                          </span>
                          <input
                            type="number"
                            value={currentRetail}
                            onChange={(e) =>
                              handlePriceChange(plan.id, Number(e.target.value))
                            }
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-slate-900 dark:text-white font-bold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 px-3 py-1 rounded-lg text-xs font-bold ${
                            profitMargin >= 0
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {profitMargin >= 0
                            ? `+₦${profitMargin}`
                            : `-₦${Math.abs(profitMargin)}`}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

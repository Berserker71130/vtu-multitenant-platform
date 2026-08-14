"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import { StatsCard } from "@/components/StatsCard";
import { useTenant } from "@/context/TenantContext";
import { BasePlan } from "@/types";
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

  // Load persistent markups on initial load
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Dynamic Navbar tied directly to useTenant Context */}
      <DashboardNavbar
        storeName={tenant?.name || "Apex Telecom"}
        walletBalance={walletBalance}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Reseller Control Center
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Configure markup prices, monitor active customers and trace profit
              margins.
            </p>
          </div>

          <button
            onClick={handleSaveMarkups}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all self-start md:self-auto"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Saved
                Successfully!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Price Changes
              </>
            )}
          </button>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
            value={`${(3842 + totalTxnCount).toLocaleString()}`}
            change="+8.1%"
            icon={ShoppingBag}
            iconColor="text-indigo-600 dark:text-indigo-400"
          />
          <StatsCard
            title="Active Customers"
            value="612"
            change="+12"
            icon={Users}
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </div>

        {/* Markup Price Configuration Table */}
        <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Plan Markup & Custom Pricing
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Set customer retail prices over wholesale base rates.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 min-w-[650px]">
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
                        <span className="px-2 py-1 text-[10px] font-black rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-300 dark:border-slate-700">
                          {plan.network}
                        </span>
                        {plan.name}
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
                      <td className="px-4 sm:px-6 py-4 text-right whitespace-nowrap">
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

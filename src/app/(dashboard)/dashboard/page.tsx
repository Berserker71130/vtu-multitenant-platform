"use client";

import { DashboardNavbar } from "@/components/DashboardNavbar";
import { StatsCard } from "@/components/StatsCard";
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
import { useState } from "react";

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
  const [markups, setMarkups] = useState<Record<string, number>>({
    "bp-1": 270,
    "bp-2": 520,
    "bp-3": 420,
    "bp-4": 600,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePriceChange = (planId: string, newPrice: number) => {
    setMarkups((prev) => ({ ...prev, [planId]: newPrice }));
  };

  const handleSaveMarkups = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Dynamic Header */}
      <DashboardNavbar storeName="Apex Telecom" walletBalance={48500} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Reseller Control Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
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
            value="₦1,240,500"
            change="+14.2%"
            icon={DollarSign}
            iconColor="text-emerald-400"
          />
          <StatsCard
            title="Net Profit Margin"
            value="₦184,200"
            change="+18.5%"
            icon={TrendingUp}
            iconColor="text-blue-400"
          />
          <StatsCard
            title="Total Transactions"
            value="3,842"
            change="+8.1%"
            icon={ShoppingBag}
            iconColor="text-indigo-400"
          />
          <StatsCard
            title="Active Customers"
            value="612"
            change="+12"
            icon={Users}
            iconColor="text-amber-400"
          />
        </div>

        {/* Markup Price Configuration Table */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  Plan Narkup & Custom Pricing
                </h2>
                <p className="text-xs text-slate-400">
                  Set customer retail prices over wholesale base rates.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/50 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Network / Plan</th>
                  <th className="px-6 py-4">Validity</th>
                  <th className="px-6 py-4">Wholesale Base</th>
                  <th className="px-6 py-4">Your Retail Price (₦)</th>
                  <th className="px-6 py-4 text-right">Profit / Sale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {INITIAL_BASE_PLANS.map((plan) => {
                  const currentRetail = markups[plan.id] || plan.basePrice;
                  const profitMargin = currentRetail - plan.basePrice;

                  return (
                    <motion.tr
                      key={plan.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <span className="px-2 py-1 text-[10px] font-black rounded-md bg-slate-800 text-blue-400 border border-slate-700">
                          {plan.network}
                        </span>
                        {plan.name}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {plan.validity}
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        ₦{plan.basePrice}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative max-w-[140px]">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                            ₦
                          </span>
                          <input
                            type="number"
                            value={currentRetail}
                            onChange={(e) =>
                              handlePriceChange(plan.id, Number(e.target.value))
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-bold text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-xs ${profitMargin >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                        >
                          +₦{profitMargin}
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

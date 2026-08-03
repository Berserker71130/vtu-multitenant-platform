"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  ExternalLink,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Sliders,
  Sparkles,
  Store,
  Wifi,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLandingPage() {
  const router = useRouter();
  const [storeSlugInput, setStoreSlugInput] = useState("apex-telecom");
  const [dailySalesCount, setDailySalesCount] = useState(250);
  const averageProfitPerSale = 60;

  const calculatedMonthlyProfit = dailySalesCount * averageProfitPerSale * 30;

  const handleLaunchStorePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeSlugInput.trim()) {
      const sanitizedSlug = storeSlugInput
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-");
      router.push(`/${sanitizedSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/15 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Global Navigation Header */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl px-6 py-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-xl">
              V
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                VTU Reseller
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Multi-Tenant
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all flex items-center gap-2 shadow-sm dark:shadow-none"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Reseller Console</span>
            </Link>
            <Link
              href="apex-telecom"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4" />
              Demo Storefront
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 mb-6 shadow-sm dark:shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Next-Gen Multi-Tenant VTU Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Launch Your Own{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 dark:from-blue-400 dark:via-indigo-400 dark:to-emerald-400">
              Branded VTU Business
            </span>{" "}
            in Seconds.
          </h1>

          <p className="mt-6 text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Empower resellers to create isolated storefronts, set custom pricing
            markups on base data/airtime plans, and process instant customer
            transactions automatically.
          </p>
        </motion.div>

        {/* Live storefront URL Test Drive Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 max-w-2xl mx-auto p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors"
        >
          <form
            onSubmit={handleLaunchStorePreview}
            className="flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex items-center gap-2 px-3 py-2 w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-400">
              <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-slate-400 dark:text-slate-500 hidden sm:inline">
                vtuplatform.com
              </span>
              <input
                type="text"
                value={storeSlugInput}
                onChange={(e) => setStoreSlugInput(e.target.value)}
                placeholder="your-brand-slug"
                className="bg-transparent text-slate-900 dark:text-white font-bold outline-none w-full placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm whitespace-nowrap shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Test Storefront <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-2 text-left px-2">
            Try default test stores:{" "}
            <button
              type="button"
              onClick={() => setStoreSlugInput("apex-telecom")}
              className="text-blue-600 dark:text-blue-400 underline font-semibold"
            >
              apex-telecom
            </button>{" "}
            or{" "}
            <button
              type="button"
              onClick={() => setStoreSlugInput("power-connect")}
              className="text-blue-600 dark:text-blue-400 underline font-semibold"
            >
              power-connect
            </button>
          </p>
        </motion.div>
      </section>

      {/* Live Interactive Profit Calculator */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl relative overflow-hidden shadow-sm dark:shadow-none transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Automated Financial Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Calculate Your Reseller Profit Margins
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                Resellers add custom pricing markups over wholesale base API
                rates. Every customer transaction yields instant profit straight
                to the reseller master wallet.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span>Projected Daily Transactions</span>
                    <span className="text-blue-600 dark:text-blue-400 font-extrabold text-sm">
                      {dailySalesCount} Sales / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={dailySalesCount}
                    onChange={(e) => setDailySalesCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 text-center flex flex-col justify-center transition-colors">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Estimated Monthly Net Profit
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                ₦{calculatedMonthlyProfit.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Based on an average ₦{averageProfitPerSale} markup profit per
                1GB SME Data transaction.
              </p>

              <Link
                href="/dashboard"
                className="mt-6 w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                Configure Pricing in Reseller Console{" "}
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Architecture Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Enterprise Multi-Tenant Capabilities
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            Built for high concurrency, zero data leakage and automated
            execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Strict Data Isolation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Every tenant operates within a sandbox context. Customers, order
              histories, and wallets are isolated per reseller.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-4">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Dynamic Markup Control
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Resellers override wholesale base rates with custom pricing
              matrices. Profit margins accumulate automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit mb-4">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              4-Network Instant Dispatch
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
              Automated integration with MTN, Airtel, Glo and 9mobile VTU
              endpoints for sub-second fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Quick access portals directory */}
      <section className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 dark:border-slate-800/80 transition-colors">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
          Quick-Launch System Portals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/apex-telecom"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between group shadow-sm dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Apex Telecom
                </p>
                <p className="text-xs text-slate-500">Storefront Demo 1</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/power-connect"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 transition-all flex items-center justify-between group shadow-sm dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  PowerConnect VTU
                </p>
                <p className="text-xs text-slate-500">Storefront Demo 2</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/dashboard"
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group shadow-sm dark:shadow-none"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Reseller Console
                </p>
                <p className="text-xs text-slate-500">Markup & Sales Manager</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-8 px-6 text-center text-xs text-slate-500 dark:text-slate-600 transition-colors">
        <p>
          Enterprise Multi-Tenant VTU Platform - Engineered With Next.js 15,
          TypeScript & Tailwind CSS.
        </p>
      </footer>
    </div>
  );
}

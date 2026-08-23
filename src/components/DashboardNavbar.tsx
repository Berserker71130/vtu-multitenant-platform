"use client";

import React, { useState } from "react";
import { Bell, Plus, UserCheck, Wallet, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { CheckoutModal } from "./CheckoutModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  storeName: string;
  walletBalance: number;
}

export function DashboardNavbar({ storeName, walletBalance }: NavbarProps) {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      router.refresh();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-colors duration-300">
        {/* Left: Brand / Tenant Info */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-sm sm:text-base shrink-0">
            {storeName.charAt(0)}
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 truncate">
              <span className="truncate">{storeName}</span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                Verified Tenant
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
              Reseller Management Console
            </p>
          </div>
        </div>

        {/* Right: Actions & Balance */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Wallet Pill */}
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="flex sm:hidden items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold text-xs"
          >
            <Wallet className="w-3.5 h-3.5 shrink-0" />
            <span>₦{walletBalance.toLocaleString()}</span>
          </button>

          {/* Desktop Interactive Wallet Pill */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-3.5 pr-2 py-1.5 rounded-xl">
            <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-left">
              <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                Master Balance
              </p>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                ₦{walletBalance.toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => setIsTopUpOpen(true)}
              className="ml-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              <span>Fund</span>
            </button>
          </div>

          <ThemeToggle />

          <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shrink-0">
            <Bell className="w-4 h-4" />
          </button>

          {/* User Icon Badge */}
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
            <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Log out"
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-all shrink-0 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </header>

      {/* Top-up Wallet Modal */}
      <CheckoutModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        mode="TOP_UP"
        storeName={storeName}
      />
    </>
  );
}

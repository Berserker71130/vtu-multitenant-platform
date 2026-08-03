"use client";

import { Bell, UserCheck, Wallet } from "lucide-react";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  storeName: string;
  walletBalance: number;
}

export function DashboardNavbar({ storeName, walletBalance }: NavbarProps) {
  return (
    /* MODIFIED: Outer Header background, border, and transition */
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black">
          {storeName.charAt(0)}
        </div>
        <div>
          {/* MODIFIED: Main Store Name Text Color */}
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {storeName}
            {/* MODIFIED: Verified Pill Text Color */}
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Verified Tenant
            </span>
          </h2>
          {/* MODIFIED: Subtitle Text Color */}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reseller Management Console
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Wallet Pill */}
        {/* MODIFIED: Wallet Pill Background & Border */}
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-xl">
          {/* MODIFIED: Wallet Icon Color */}
          <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <div className="text-left">
            {/* MODIFIED: Label Text Color */}
            <p className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
              Master Balance
            </p>
            {/* MODIFIED: Balance Text Color */}
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
              ₦{walletBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <ThemeToggle />

        {/* Quick Actions */}
        {/* MODIFIED: Bell Button Background, Border, Hover State, & Text Colors */}
        <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
          <Bell className="w-4 h-4" />
        </button>

        {/* User Icon Avatar */}
        {/* MODIFIED: Avatar Circle Background, Border, Text Color, & Icon Color */}
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
          <UserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </header>
  );
}

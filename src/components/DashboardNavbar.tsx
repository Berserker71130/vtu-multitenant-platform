"use client";

import { Bell, UserCheck, Wallet } from "lucide-react";
import React from "react";

interface NavbarProps {
  storeName: string;
  walletBalance: number;
}

export function DashboardNavbar({ storeName, walletBalance }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black">
          {storeName.charAt(0)}
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            {storeName}
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Tenant
            </span>
          </h2>
          <p className="text-xs text-slate-400">Reseller Management Console</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Wallet Pill */}
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <p className="text-[10px] uppercase font-semibold text-slate-500">
              Master Balance
            </p>
            <p className="text-xs font-bold text-slate-100">
              ₦{walletBalance.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all">
          <Bell className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
          <UserCheck className="w-4 h-4 text-blue-400" />
        </div>
      </div>
    </header>
  );
}

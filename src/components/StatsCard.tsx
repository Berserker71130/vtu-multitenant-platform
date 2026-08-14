"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBgColor = "bg-blue-500/10 dark:bg-blue-500/10",
}: StatsCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`p-2.5 rounded-xl ${iconBgColor} ${iconColor} transition-colors`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
              isPositive
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

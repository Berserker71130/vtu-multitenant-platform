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
}

export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = "text-blue-400",
}: StatsCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`p-2 rounded-xl bg-slate-800/60 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-black tracking-tight text-white">
          {value}
        </h3>
        {change && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

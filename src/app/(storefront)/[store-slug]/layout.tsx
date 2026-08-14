"use client";

import React from "react";
import { TenantProvider } from "@/context/TenantContext";

export default function StoreFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
        <main>{children}</main>
      </div>
    </TenantProvider>
  );
}

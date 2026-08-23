import React from "react";
import { TenantProvider } from "@/context/TenantContext";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Await the server client creation
  const supabase = await createClient();

  // 2. Check user authentication on the server
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 3. If unauthorized, immediately bounce them to login
  if (error || !user) {
    redirect("/login");
  }

  // 4. If authorized, render the tenant provider and dashboard content normally
  return (
    <TenantProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-300">
        {children}
      </div>
    </TenantProvider>
  );
}

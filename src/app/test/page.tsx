"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProviders() {
      const { data, error } = await supabase
        .from("network_providers")
        .select("*");
      if (error) {
        console.error("Error fetching providers:", error);
      } else {
        setProviders(data || []);
      }
    }
    fetchProviders();
  }, []);

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      <ul className="space-y-2">
        {providers.map((p) => (
          <li key={p.id} className="p-3 border rounded shadow-sm">
            <strong>{p.name}</strong> - Latency: {p.latency_ms}ms | Float: ₦
            {p.provider_float}
          </li>
        ))}
      </ul>
    </main>
  );
}

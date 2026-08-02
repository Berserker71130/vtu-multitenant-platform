"use client";

import { TenantStore } from "@/types";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface TenantContextType {
  tenant: TenantStore | null;
  isLoading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  error: null,
});

// Mock stores for local testing before API integration
const MOCK_STORES: Record<string, TenantStore> = {
  "apex-telecom": {
    id: "tenant-1",
    name: "Apex Telecome",
    slug: "apex-telecom",
    resellerId: "user-101",
    branding: {
      primaryColor: "#2563eb",
      secondaryColor: "#1e293b",
      accentColor: "#10b981",
      tagline: "Instant VTU Airtime & SME Data Bundles",
    },
    status: "active",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  "power-connect": {
    id: "tenant-2",
    name: "PowerConnect VTU",
    slug: "power-connect",
    resellerId: "user-102",
    branding: {
      primaryColor: "#7c3aed",
      secondaryColor: "#0f172a",
      accentColor: "#f59e0b",
      tagline: "Cheapest  Data in Nigeria",
    },
    status: "active",
    createdAt: "2026-08-01T00:00:00.000Z",
  },
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const [tenant, setTenant] = useState<TenantStore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storeSlug = params?.["store-slug"] as string;

    if (!storeSlug) {
      setIsLoading(false);
      return;
    }

    // Lookup tenant store
    const foundTenant = MOCK_STORES[storeSlug];

    if (foundTenant) {
      setTenant(foundTenant);
      setError(null);
    } else {
      setTenant(null);
      setError(`Store "${storeSlug}" was not found or has been suspended.`);
    }

    setIsLoading(false);
  }, [params]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);

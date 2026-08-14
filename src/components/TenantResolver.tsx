"use client";

import { createContext, useContext, ReactNode } from "react";
import { Tenant } from "@/types/db";

interface TenantContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  isNotFound: boolean;
}

const TenantIsolationContext = createContext<TenantContextType>({
  tenant: null,
  isLoading: true,
  isNotFound: false,
});
export const TenantResolverProvider = ({
  tenant,
  children,
}: {
  tenant: Tenant | null;
  children: ReactNode;
}) => {
  return (
    <TenantIsolationContext.Provider
      value={{
        tenant,
        isLoading: false,
        isNotFound: !tenant,
      }}
    >
      {children}
    </TenantIsolationContext.Provider>
  );
};

export const useIsolatedTenant = () => useContext(TenantIsolationContext);

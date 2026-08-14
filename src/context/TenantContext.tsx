"use client";

import { TenantStore } from "@/types";
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: "success" | "pending" | "failed";
}

interface TenantContextType {
  tenant: TenantStore | null;
  walletBalance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fundWallet: (amount: number, description?: string) => void;
  deductWallet: (amount: number, description?: string) => boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  walletBalance: 0,
  transactions: [],
  isLoading: true,
  error: null,
  fundWallet: () => {},
  deductWallet: () => false,
});

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
      tagline: "Cheapest Data in Nigeria",
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
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const activeSlug = (params?.["store-slug"] as string) || "apex-telecom";

  // Load store data & persistent local wallet state
  useEffect(() => {
    const foundTenant = MOCK_STORES[activeSlug] || MOCK_STORES["apex-telecom"];
    setTenant(foundTenant);
    setError(null);

    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem(`vtu_wallet_${activeSlug}`);
      const savedTxns = localStorage.getItem(`vtu_txns_${activeSlug}`);

      setWalletBalance(savedBalance ? parseFloat(savedBalance) : 0);
      setTransactions(savedTxns ? JSON.parse(savedTxns) : []);
    }

    setIsLoading(false);
  }, [activeSlug]);

  // Credit/Fund Wallet Function
  const fundWallet = (amount: number, description = "Wallet Top-up") => {
    const newBalance = walletBalance + amount;
    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      type: "credit",
      amount,
      description,
      date: new Date().toISOString(),
      status: "success",
    };

    const updatedTxns = [newTxn, ...transactions];

    setWalletBalance(newBalance);
    setTransactions(updatedTxns);

    if (typeof window !== "undefined") {
      localStorage.setItem(`vtu_wallet_${activeSlug}`, newBalance.toString());
      localStorage.setItem(
        `vtu_txns_${activeSlug}`,
        JSON.stringify(updatedTxns),
      );
    }
  };

  // Debit/Purchase Function
  const deductWallet = (
    amount: number,
    description = "VTU Purchase",
  ): boolean => {
    if (walletBalance < amount) {
      return false; // Insufficient Funds
    }

    const newBalance = walletBalance - amount;
    const newTxn: Transaction = {
      id: `txn_${Date.now()}`,
      type: "debit",
      amount,
      description,
      date: new Date().toISOString(),
      status: "success",
    };

    const updatedTxns = [newTxn, ...transactions];

    setWalletBalance(newBalance);
    setTransactions(updatedTxns);

    if (typeof window !== "undefined") {
      localStorage.setItem(`vtu_wallet_${activeSlug}`, newBalance.toString());
      localStorage.setItem(
        `vtu_txns_${activeSlug}`,
        JSON.stringify(updatedTxns),
      );
    }

    return true;
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        walletBalance,
        transactions,
        isLoading,
        error,
        fundWallet,
        deductWallet,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);

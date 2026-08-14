export type TenantStatus = "PENDING" | "APPROVED" | "SUSPENDED";
export type UserRole = "SUPER_ADMIN" | "RESELLER" | "CUSTOMER";
export type TransactionType =
  | "WALLET_TOPUP"
  | "DATA_PURCHASE"
  | "AIRTIME_PURCHASE";
export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface TenantBranding {
  logoUrl?: string;
  primaryColor?: string;
  tagline?: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  status: TenantStatus;
  pricingMarkup: number;
  branding: TenantBranding;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  tenantId: string | null;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  tenantId: string; // Isolated per tenant
  userId: string;
  balance: number;
  currency: string;
  updatedAt: Date;
}

export interface CustomPlanPricing {
  id: string;
  tenantId: string; // Scoped to reseller
  basePlanId: string; // Reference to global base plan from api/v1/plans
  customRetailPrice: number;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  tenantId: string; // Critical for multi-tenant isolation
  userId: string;
  type: TransactionType;
  amount: number;
  profit: number; // Reseller profit earned
  status: TransactionStatus;
  reference: string;
  networkProvider?: string;
  recipientPhone?: string;
  createdAt: Date;
}

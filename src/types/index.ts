// 1. TENANT & BRANDING TYPES
export interface StoreBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  tagline?: string;
}

export interface TenantStore {
  id: string;
  name: string;
  slug: string;
  resellerId: string;
  branding: StoreBranding;
  customDomain?: string;
  status: "active" | "suspended" | "pending";
  pricingMarkup?: number;
  createdAt: string;
}

// 2. USER & AUTHENTICATION TYPES
export type UserRole = "super_admin" | "reseller" | "customer";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  role?: UserRole;
  tenantId?: string;
  createdAt?: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

export interface AuthResponseData {
  id: string;
  email: string;
  api_key: string;
}

// 3. BASE & CUSTOM VTU PLAN TYPES
export type NetworkProvider = "MTN" | "GLO" | "AIRTEL" | "9MOBILE";
export type PlanType = "DATA" | "AIRTIME";

export interface BasePlan {
  id: string;
  network: NetworkProvider;
  type: PlanType;
  name: string;
  value: string;
  validity: string;
  basePrice: number;
  isActive: boolean;
}

export interface ResellerPlanMarkup {
  id: string;
  tenantId: string;
  basePlanId: string;
  customPrice: number;
  marginProfit: number;
  isEnabled: boolean;
}

// Display interface for Storefront (Base plan + reseller markup applied)
export interface RetailPlan extends BasePlan {
  sellingPrice: number;
  marginProfit: number;
}

// 4. WALLET TRANSACTION TYPES
export interface Wallet {
  id: string;
  ownerId: string;
  tenantId?: string;
  balance: number;
  currency: string;
  updatedAt: string;
}

export type TransactionType =
  | "WALLET_TOPUP"
  | "AIRTIME_PURCHASE"
  | "DATA_PURCHASE"
  | "REFUND";
export type TransactionStatus = "SUCCESS" | "PENDING" | "FAILED";

export interface Transaction {
  id: string;
  reference: string;
  tenantId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  recipientPhone: string;
  network?: NetworkProvider;
  planDetails?: string;
  createdAt: string;
}

// 5. RESELLER METRICS & ANALYTICS
export interface ResellerAnalytics {
  totalSales: number;
  totalProfit: number;
  totalCustomers: number;
  walletBalance: number;
  recentTransactions: Transaction[];
}

// 6. API REQUEST & RESPONSE PAYLOADS
export interface PurchasePayload {
  network: NetworkProvider;
  planId: string;
  phoneNumber: string;
  amount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string; // Made optional to prevent type errors on endpoints without a message field
  error?: string;
  data: T;
}

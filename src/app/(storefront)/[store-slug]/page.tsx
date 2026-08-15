"use client";

import React, { useState, use } from "react";
import { useTenant } from "@/context/TenantContext";
import { BasePlan, NetworkProvider } from "@/types";
import { Smartphone, Wallet, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { CheckoutModal, ModalMode } from "@/components/CheckoutModal";
import { ThemeToggle } from "@/components/ThemeToggle";

// Helper component for styled network badges & colors
const NetworkLogo = ({ network }: { network: NetworkProvider }) => {
  switch (network) {
    case "MTN":
      return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-sm">
          MTN
        </div>
      );
    case "AIRTEL":
      return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 text-white font-black text-[9px] sm:text-xs flex items-center justify-center shrink-0 shadow-sm">
          airtel
        </div>
      );
    case "GLO":
      return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-600 text-white font-black text-[10px] sm:text-xs flex items-center justify-center shrink-0 shadow-sm">
          glo
        </div>
      );
    case "9MOBILE":
      return (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-teal-700 text-lime-400 font-black text-[8px] sm:text-[10px] flex items-center justify-center shrink-0 shadow-sm">
          9mob
        </div>
      );
    default:
      return null;
  }
};

const MOCK_PLANS: BasePlan[] = [
  {
    id: "1",
    network: "MTN",
    type: "DATA",
    name: "1.0 GB SME Data",
    value: "1GB",
    validity: "30 Days",
    basePrice: 220,
    isActive: true,
  },
  {
    id: "2",
    network: "MTN",
    type: "DATA",
    name: "2.0 GB SME Data",
    value: "2GB",
    validity: "30 Days",
    basePrice: 440,
    isActive: true,
  },
  {
    id: "3",
    network: "AIRTEL",
    type: "DATA",
    name: "1.5 GB Direct Data",
    value: "1.5GB",
    validity: "30 Days",
    basePrice: 350,
    isActive: true,
  },
  {
    id: "4",
    network: "GLO",
    type: "DATA",
    name: "2.5 GB Corporate",
    value: "2.5GB",
    validity: "30 Days",
    basePrice: 500,
    isActive: true,
  },
];

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ "store-slug": string }>;
}) {
  const resolvedParams = use(params);
  const storeSlug = resolvedParams["store-slug"];

  const { tenant, walletBalance } = useTenant();
  const [selectedNetwork, setSelectedNetwork] =
    useState<NetworkProvider>("MTN");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("BUY_PLAN");
  const [activePlan, setActivePlan] = useState<BasePlan | null>(null);

  const markup = tenant?.pricingMarkup ?? 5;

  const calculateRetailPrice = (basePrice: number) => {
    return Math.round(basePrice * (1 + markup / 100));
  };

  const filteredPlans = MOCK_PLANS.filter(
    (plan) => plan.network === selectedNetwork,
  );

  const handleOpenBuyModal = (plan: BasePlan) => {
    const planWithRetailPrice: BasePlan = {
      ...plan,
      basePrice: calculateRetailPrice(plan.basePrice),
    };
    setActivePlan(planWithRetailPrice);
    setModalMode("BUY_PLAN");
    setIsModalOpen(true);
  };

  const handleOpenTopUpModal = () => {
    setActivePlan(null);
    setModalMode("TOP_UP");
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Hero Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 backdrop-blur-md mb-6 sm:mb-8 shadow-sm dark:shadow-none transition-colors duration-300">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Branded Storefront
          </span>
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 sm:mt-1">
            {tenant?.name || storeSlug}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5 sm:mt-1">
            {tenant?.branding?.tagline ||
              "Fast & Automated Airtime and Data VTU"}
          </p>
        </div>

        <div className="w-full md:w-auto flex items-center justify-between sm:justify-start gap-3 bg-slate-100 dark:bg-slate-950 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Customer Wallet
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                ₦{walletBalance ? walletBalance.toLocaleString() : "0"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTopUpModal}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20"
            >
              Fund Wallet
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Network Provider Selector */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-sm sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 sm:mb-4">
          1. Select Network
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {(["MTN", "AIRTEL", "GLO", "9MOBILE"] as NetworkProvider[]).map(
            (network) => (
              <button
                key={network}
                onClick={() => setSelectedNetwork(network)}
                className={`p-2.5 sm:p-4 rounded-xl border flex items-center justify-between transition-all ${
                  selectedNetwork === network
                    ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-white shadow-md shadow-blue-500/10 font-bold"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm dark:shadow-none"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <NetworkLogo network={network} />
                  <span className="font-bold text-xs sm:text-base">
                    {network}
                  </span>
                </div>
                {selectedNetwork === network && (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </button>
            ),
          )}
        </div>
      </section>

      {/* Plan Selection Cards (2-Column Mobile Grid) */}
      <section>
        <h2 className="text-sm sm:text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 sm:mb-4">
          2. Select Plan
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {filteredPlans.map((plan) => {
            const retailPrice = calculateRetailPrice(plan.basePrice);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -3 }}
                className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm dark:shadow-none"
              >
                <div>
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {plan.validity}
                    </span>
                    <Smartphone className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-xs sm:text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {plan.name}
                  </h3>
                  <div className="mt-1.5 sm:mt-2 flex items-baseline gap-1.5 flex-wrap">
                    <p className="text-sm sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                      ₦{retailPrice.toLocaleString()}
                    </p>
                    {markup > 0 && (
                      <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                        ₦{Math.round(retailPrice * 1.05).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenBuyModal(plan)}
                  className="mt-3 sm:mt-6 w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-800 hover:text-white dark:text-slate-200 dark:hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1 sm:gap-2"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Embedded Transaction Modal */}
      <CheckoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        selectedPlan={activePlan}
        storeName={tenant?.name || storeSlug}
      />
    </div>
  );
}

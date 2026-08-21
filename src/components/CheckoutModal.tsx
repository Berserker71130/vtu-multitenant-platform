"use client";
const supabase = createClient();

import { useState } from "react";
import { BasePlan, NetworkProvider } from "@/types";
import { useTenant } from "@/context/TenantContext";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";

export type ModalMode = "BUY_PLAN" | "TOP_UP";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: ModalMode;
  selectedPlan?: BasePlan | null;
  storeName: string;
}

const NetworkBadge = ({ network }: { network: NetworkProvider }) => {
  switch (network) {
    case "MTN":
      return (
        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm">
          MTN
        </span>
      );
    case "AIRTEL":
      return (
        <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-[8px] flex items-center justify-center shrink-0 shadow-sm">
          airtel
        </span>
      );
    case "GLO":
      return (
        <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-black text-[9px] flex items-center justify-center shrink-0 shadow-sm">
          glo
        </span>
      );
    case "9MOBILE":
      return (
        <span className="w-6 h-6 rounded-full bg-teal-700 text-lime-400 font-black text-[7px] flex items-center justify-center shrink-0 shadow-sm">
          9mob
        </span>
      );
    default:
      return null;
  }
};

export function CheckoutModal({
  isOpen,
  onClose,
  mode,
  selectedPlan,
  storeName,
}: CheckoutModalProps) {
  const { tenant, walletBalance, fundWallet, deductWallet } = useTenant();

  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("2000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [txRef, setTxRef] = useState("");

  if (!isOpen) return null;

  const handleProcessTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsProcessing(true);

    const generatedRef = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    setTxRef(generatedRef);

    try {
      if (mode === "BUY_PLAN" && selectedPlan) {
        const cost = selectedPlan.basePrice;

        if (walletBalance < cost) {
          setIsProcessing(false);
          setErrorMessage(
            `Insufficient wallet balance (₦${walletBalance.toLocaleString()}). Please top up first.`,
          );

          return;
        }

        const txDescription = `${selectedPlan.network} ${selectedPlan.name} -> ${phone}`;

        const localDeductSuccess = deductWallet(cost, txDescription);
        if (!localDeductSuccess) {
          setIsProcessing(false);
          setErrorMessage("Failed to process local wallet deduction.");
          return;
        }

        // Full audit log payload into Supabase
        const { error: txError } = await supabase.from("transactions").insert({
          reference: generatedRef,
          tenant_id:
            tenant?.id && tenant.id.includes("-") && tenant.id.length > 20
              ? tenant.id
              : null,
          tenant_slug: tenant?.slug || storeName || "default-tenant",
          type: "debit",
          amount: cost,
          description: txDescription,
          phone_number: phone,
          network: selectedPlan.network,
          plan_name: selectedPlan.name,
          status: "success",
          created_at: new Date().toISOString(),
        });

        if (txError) {
          console.error("Supabase Transaction Insert Error:", txError.message);
          setIsProcessing(false);
          setErrorMessage(`Database transaction failed: ${txError.message}`);
          return;
        }

        // Atomic balance update on Supabase wallets table using clean .eq() filters
        const newBalance = walletBalance - cost;
        if (tenant?.id) {
          await supabase
            .from("wallets")
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("tenant_id", tenant.id);
        } else if (tenant?.slug) {
          await supabase
            .from("wallets")
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("tenant_slug", tenant.slug);
        }
      } else if (mode === "TOP_UP") {
        const topUpAmount = Number(amount);
        if (isNaN(topUpAmount) || topUpAmount <= 0) {
          setIsProcessing(false);
          setErrorMessage("Please enter a valid top-up amount.");
          return;
        }

        const topUpDesc = `Wallet Top-Up via ${storeName}`;
        fundWallet(topUpAmount, topUpDesc);

        const { error: txError } = await supabase.from("transactions").insert({
          reference: generatedRef,
          tenant_id:
            tenant?.id && tenant.id.includes("-") && tenant.id.length > 20
              ? tenant.id
              : null,
          tenant_slug: tenant?.slug || storeName || "default-tenant",
          type: "credit",
          amount: topUpAmount,
          description: topUpDesc,
          phone_number: phone,
          status: "success",
          created_at: new Date().toISOString(),
        });

        if (txError) {
          console.error("Supabase Top-Up Insert Error:", txError.message);
          setIsProcessing(false);
          setErrorMessage(`Database top-up failed: ${txError.message}`);
          return;
        }

        const newBalance = walletBalance + topUpAmount;
        if (tenant?.id) {
          await supabase
            .from("wallets")
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("tenant_id", tenant.id);
        } else if (tenant?.slug) {
          await supabase
            .from("wallets")
            .update({
              balance: newBalance,
              updated_at: new Date().toISOString(),
            })
            .eq("tenant_slug", tenant.slug);
        }
      }

      setIsProcessing(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Transaction Error:", err);
      setIsProcessing(false);
      setErrorMessage(`Transaction failed: ${err.message}`);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setErrorMessage("");
    setPhone("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl overflow-hidden transition-colors max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <div className="text-center py-4 sm:py-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Transaction Successful!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                {mode === "BUY_PLAN"
                  ? `Data plan successfully dispatched to ${phone} via ${selectedPlan?.network}.`
                  : `Your wallet topup of ₦${Number(amount).toLocaleString()} was confirmed.`}
              </p>

              <div className="mt-5 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Merchant:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {storeName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Reference ID:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {txRef}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Instant Delivered
                  </span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all"
              >
                Done & Continue
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  {mode === "BUY_PLAN" ? (
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {mode === "BUY_PLAN"
                      ? "Instant Data Dispatch"
                      : "Fund Customer Wallet"}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    {storeName} Gateway
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleProcessTransaction} className="space-y-4">
                {mode === "BUY_PLAN" && selectedPlan && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <NetworkBadge network={selectedPlan.network} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {selectedPlan.network}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {selectedPlan.validity}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {selectedPlan.name}
                    </p>
                    <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                      ₦{selectedPlan.basePrice.toLocaleString()}
                    </p>
                  </div>
                )}

                {mode === "BUY_PLAN" ? (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Target Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g 08012345678"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Top-Up Amount (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-bold text-sm focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                )}

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />{" "}
                        Processing Dispatch...
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "BUY_PLAN"
                            ? "Confirm & Purchase"
                            : "Proceed to Payment"}
                        </span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>256-Bit Encrypted VTU Settlement</span>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

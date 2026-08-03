"use client";

import { useState } from "react";
import { BasePlan } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
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

export function CheckoutModal({
  isOpen,
  onClose,
  mode,
  selectedPlan,
  storeName,
}: CheckoutModalProps) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("2000");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleProcessTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate sub-second VTU dispatch / gateway execution
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setIsProcessing(false);
    setPhone("");
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            // Success state
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">
                Transaction Successful!
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                {mode === "BUY_PLAN"
                  ? `Data plan successfuly dispatched to ${phone} via ${selectedPlan?.network}.`
                  : `Your wallet topup of ₦${Number(amount).toLocaleString()} was confirmed.`}
              </p>

              <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Merchant:</span>
                  <span className="font-bold text-white">{storeName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reference ID:</span>
                  <span className="font-mono text-blue-400">
                    TXN-{Math.floor(100000 + Math.random() * 900000)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Status:</span>
                  <span className="font-bold text-emerald-400 uppercase">
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
            // Active Form State
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                  {mode === "BUY_PLAN" ? (
                    <Smartphone className="w-6 h-6" />
                  ) : (
                    <Wallet className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {mode === "BUY_PLAN"
                      ? "Instant Data Dispatch"
                      : "Fund Customer Wallet"}
                  </h3>
                  <p className="text-xs text-slate-400">{storeName} Gateway</p>
                </div>
              </div>

              <form onSubmit={handleProcessTransaction} className="space-y-4">
                {mode === "BUY_PLAN" && selectedPlan && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-blue-400">
                        {selectedPlan.network}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {selectedPlan.validity}
                      </span>
                    </div>
                    <p className="text-base font-bold text-white">
                      {selectedPlan.name}
                    </p>
                    <p className="text-xl font-extrabold text-emerald-400 mt-2">
                      ₦{selectedPlan.basePrice}
                    </p>
                  </div>
                )}

                {mode === "BUY_PLAN" ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Target Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g 08012345678"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Top-Up Amount (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold text-sm focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                )}

                <div className="pt-2 ">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing
                        Dispatch...
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === "BUY_PLAN"
                            ? "Confirm & Purchase"
                            : "Proceed to Payment"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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

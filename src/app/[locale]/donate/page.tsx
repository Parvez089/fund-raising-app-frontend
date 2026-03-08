/** @format */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Award,
  Info,
  HelpCircle,
} from "lucide-react";

// ── Payment methods data ───────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "bkash",
    name: "bKash",
    number: "01828 991 168",
    color: "bg-pink-500",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
    bgLight: "bg-pink-50",
    deepLink: "https://play.google.com/store/apps/details?id=com.bKash.customerapp&pcampaignid=web_share",
    logo: "bKash",
  },
//   {
//     id: "nagad",
//     name: "Nagad",
//     number: "01812 345 678",
//     color: "bg-orange-500",
//     textColor: "text-orange-600",
//     borderColor: "border-orange-200",
//     bgLight: "bg-orange-50",
//     deepLink: "https://nagad.com.bd",
//     logo: "Nagad",
//   },
//   {
//     id: "rocket",
//     name: "Rocket",
//     number: "01912 345 678",
//     color: "bg-purple-500",
//     textColor: "text-purple-600",
//     borderColor: "border-purple-200",
//     bgLight: "bg-purple-50",
//     deepLink: "https://rocket.dutchbanglabank.com",
//     logo: "Rocket",
//   },
//   {
//     id: "upay",
//     name: "Upay",
//     number: "01612 345 678",
//     color: "bg-emerald-500",
//     textColor: "text-emerald-600",
//     borderColor: "border-emerald-200",
//     bgLight: "bg-emerald-50",
//     deepLink: "https://upaybd.com",
//     logo: "Upay",
//   },
];

export default function DonatePage() {
  const locale = useLocale();
  const t = useTranslations("Donate");

  const [activeMethod, setActiveMethod] = useState(PAYMENT_METHODS[0]);
  const [copied, setCopied] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      activeMethod.number.replace(/\s/g, "")
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-100 rounded-full blur-3xl opacity-40 translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">F</span>
          </div>
          <span className="font-extrabold text-gray-900 text-sm tracking-tight">
            FundRaise BD
          </span>
        </Link>

        {/* Back to home */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition font-medium">
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>
      </header>

      {/* ── Page title ── */}
      <div className="relative z-10 text-center pt-6 pb-8 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-3">
          {t("headline")}{" "}
          <span className="text-emerald-600">{t("headlineAccent")}</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          {t("subheadline")}
        </p>
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 max-w-md mx-auto px-4 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl shadow-emerald-100/50 border border-gray-100 overflow-hidden">

          {/* Method tabs — show others toggle */}
          <AnimatePresence>
            {showOthers && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b border-gray-50 overflow-hidden">
                <div className="flex gap-2 px-5 py-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMethod(m);
                        setShowOthers(false);
                      }}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition border ${
                        activeMethod.id === m.id
                          ? `${m.bgLight} ${m.textColor} ${m.borderColor}`
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                      }`}>
                      {m.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card body */}
          <div className="px-8 py-8">
            {/* Logo area */}
            <div className="flex flex-col items-center mb-6">
              <div className={`w-16 h-16 rounded-2xl ${activeMethod.color} flex items-center justify-center shadow-lg mb-4`}>
                <span className="text-white font-black text-lg">
                  {activeMethod.logo[0]}
                </span>
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${activeMethod.textColor} mb-1`}>
                {t("officialMerchant")}
              </p>
              <h2 className="text-2xl font-black text-gray-900">
                {t("donateVia")} {activeMethod.name}
              </h2>
            </div>

            <hr className="border-gray-50 mb-6" />

            {/* Merchant number */}
            <div className="mb-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 mb-2">
                {t("merchantNumber")}
              </p>
              <div className={`flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border ${activeMethod.borderColor} ${activeMethod.bgLight}`}>
                <span className="text-2xl font-black text-gray-800 tracking-widest">
                  {activeMethod.number}
                </span>
                <button
                  onClick={handleCopy}
                  className={`w-11 h-11 rounded-xl ${activeMethod.color} flex items-center justify-center text-white shadow-md transition active:scale-95 flex-shrink-0`}>
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2 italic">
                {t("scanOrCopy")}
              </p>
            </div>

            {/* Open app button */}
            <a
              href={activeMethod.deepLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl ${activeMethod.color} text-white font-black text-base shadow-lg shadow-emerald-200/50 hover:opacity-90 transition active:scale-[0.98] mb-3`}>
              {t("openApp")} {activeMethod.name} {t("app")}
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* View other methods */}
            <button
              onClick={() => setShowOthers((v) => !v)}
              className="w-full py-4 rounded-2xl bg-gray-50 text-gray-600 font-bold text-sm hover:bg-gray-100 transition">
              {t("viewOtherMethods")}
            </button>
          </div>

          {/* Trust badges */}
          <div className="px-8 pb-6 flex items-center justify-center gap-6">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-gray-300" />
              {t("securePayment")}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-gray-300" />
              {t("officialNGO")}
            </div>
          </div>
        </motion.div>

        {/* Footer note */}
        <div className="mt-6 text-center px-4">
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("legalNote")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <button className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
              <Info className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-emerald-600 transition">
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
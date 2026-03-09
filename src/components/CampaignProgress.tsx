/** @format */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface ProgressData {
  raised: number;
  target: number;
  remaining: number;
  percent: number;
}

export default function CampaignProgress() {
  const t = useTranslations("CampaignProgress");

  // ✅ Always ৳ — no locale detection needed
  const fmt = (amount: number) => `৳${amount.toLocaleString("en-US")}`;

  const [data,    setData]    = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress`);
        const json = await res.json();
        setData(json);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  return (
    <section
      id="campaign-progress"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 md:px-8 py-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-100 rounded w-40" />
                <div className="h-3 bg-gray-100 rounded w-52" />
              </div>
              <div className="h-8 bg-gray-100 rounded w-16" />
            </div>
            <div className="h-3 bg-gray-100 rounded-full w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  {t("title")}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("subtitle", {
                    raised: fmt(data?.raised ?? 0),
                    target: fmt(data?.target ?? 0),
                  })}
                </p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-600">
                {data?.percent ?? 0}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${data?.percent ?? 0}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
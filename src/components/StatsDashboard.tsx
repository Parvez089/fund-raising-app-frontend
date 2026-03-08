"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface StatsData {
  totalFunds: number;
  targetGoal: number;
  totalDonors: number;
  activeCampaigns: number;
  monthlyGrowth: number;
  monthlyInflow: { month: string; amount: number }[];
  lastUpdated: string;
}

const StatsDashboard = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const t = useTranslations("stats");
  const common = useTranslations("common");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/stats`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading)
    return <div className="text-center py-10">{common("loading")}</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">{common("error")}</div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* card 1: Total Fund Raised */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 cursor-pointer"
        >
          <p className="text-gray-500 text-sm">{t("totalFundRaised")}</p>
          <h2 className="text-3xl font-bold">
            {/* ✅ was: data?.totalFundRaised — backend returns totalFunds */}
            ৳{(data?.totalFunds ?? 0).toLocaleString()}
          </h2>
        </motion.div>

        {/* card 2: Target Goal */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 cursor-pointer"
        >
          <p className="text-gray-500 text-sm">{t("targetGoal")}</p>
          <h2 className="text-3xl font-bold">
            ৳ {(data?.targetGoal ?? 0).toLocaleString()}
          </h2>
        </motion.div>

        {/* card 3: Active Participants */}
        <motion.div
          variants={itemVariants}
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
          }}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2 cursor-pointer"
        >
          <p className="text-gray-500 text-sm">{t("activeParticipants")}</p>
          <h2 className="text-3xl font-bold">
            {/* ✅ was: data?.activeParticipants — backend returns totalDonors */}
            {(data?.totalDonors ?? 0).toLocaleString()}
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsDashboard;
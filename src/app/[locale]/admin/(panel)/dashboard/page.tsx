/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import { Download } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

import StatsCard    from "@/components/dashboard/StatsCard";
import Chart        from "@/components/dashboard/Chart";
import QuickAddFund from "@/components/dashboard/QuickAddFund";
import UpdateTarget from "@/components/dashboard/UpdateTarget";

interface StatsData {
  totalFunds:      number;
  monthlyGrowth:   number;
  activeCampaigns: number;
  totalDonors:     number;
  targetGoal:      number;
  monthlyInflow:   { month: string; amount: number }[];
  lastUpdated:     string;
}

// Always fill 6 months — missing months get 0
function ensure6Months(
  inflow: { month: string; amount: number }[]
): { month: string; amount: number }[] {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d     = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    const real  = inflow.find((m) => m.month === label);
    return { month: label, amount: real?.amount ?? 0 };
  });
}

export default function AdminDashboard() {
  const locale = useLocale();
  const router = useRouter();

  const [stats,        setStats]        = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error,        setError]        = useState("");

  // ✅ ONLY fetch stats — NO auth check here
  // Auth is handled by layout.tsx already
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await api.get("/api/stats");
      setStats(res.data);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load stats."));
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Run once on mount only
  useEffect(() => {
    fetchStats();
  }, []); // ✅ empty deps — no re-trigger on re-render

  const chartData       = ensure6Months(stats?.monthlyInflow ?? []);
  const thisMonthAmount = chartData[chartData.length - 1]?.amount ?? 0;
  const fmt             = (n: number) =>
    `৳${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">

        {/* Title row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Financial Overview
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage and monitor your fundraising targets and contributions.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-md shadow-emerald-200 flex-shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchStats} className="text-xs font-semibold underline ml-4">
              Retry
            </button>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Funds"
            value={fmt(stats?.totalFunds ?? 0)}
            change={5.2}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Monthly Growth"
            value={`${stats?.monthlyGrowth ?? 0}%`}
            change={stats?.monthlyGrowth ?? 0}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Active Campaigns"
            value={String(stats?.activeCampaigns ?? 0)}
            change={0}
            isLoading={statsLoading}
          />
          <StatsCard
            title="Total Donors"
            value={(stats?.totalDonors ?? 0).toLocaleString()}
            change={-0.4}
            isLoading={statsLoading}
          />
        </div>

        {/* ── Chart + Widgets ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Chart
              data={chartData}
              thisMonthAmount={thisMonthAmount}
            />
          </div>
          <div className="flex flex-col gap-5">
            <QuickAddFund onSuccess={fetchStats} />
            <UpdateTarget
              currentTarget={stats?.targetGoal ?? 0}
              onSuccess={fetchStats}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
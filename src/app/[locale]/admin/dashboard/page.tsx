/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Download } from "lucide-react";
import { api } from "@/lib/api";

import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import Chart from "@/components/dashboard/Chart";
import QuickAddFund from "@/components/dashboard/QuickAddFund";
import UpdateTarget from "@/components/dashboard/UpdateTarget";

interface StatsData {
  totalFunds: number;
  monthlyGrowth: number;
  activeCampaigns: number;
  totalDonors: number;
  targetGoal: number;
  monthlyInflow: { month: string; amount: number }[];
}

interface AdminData {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  const fetchStats = useCallback(async () => {
    try {
     const res = await api.get("/api/stats");
     setStats(res.data); 
      
    } catch {
      setError("Failed to load stats. Is the backend running?");
    }
  }, []);

useEffect(() => {
  const init = async () => {
    try {
      // ✅ Axios style - no .ok or .json() needed
      const authRes = await api.get("/api/auth/me");
      setAdmin(authRes.data); // data is already parsed

      // Fetch stats
      await fetchStats();
    } catch {
      // Axios throws automatically on 401/404/500
      // so any error here means not authenticated
      router.push(`/${locale}/admin/login`);
    } finally {
      setLoading(false);
    }
  };

  init();
}, [router, locale, fetchStats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const thisMonthAmount =
    stats?.monthlyInflow?.[stats.monthlyInflow.length - 1]?.amount ?? 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar adminEmail={admin?.email} adminRole={admin?.role} />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header
          totalFunds={stats?.totalFunds ?? 0}
          targetGoal={stats?.targetGoal ?? 250000}
        />

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Page Title */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Financial Overview
              </h1>
              <p className="text-gray-400 mt-1">
                Manage and monitor your fundraising targets and contributions.
              </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-md shadow-emerald-200">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Funds"
              value={`$${(stats?.totalFunds ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
              change={5.2}
            />
            <StatsCard
              title="Monthly Growth"
              value={`+${stats?.monthlyGrowth ?? 0}%`}
              change={1.2}
            />
            <StatsCard
              title="Active Campaigns"
              value={String(stats?.activeCampaigns ?? 0)}
              change={0}
            />
            <StatsCard
              title="Total Donors"
              value={(stats?.totalDonors ?? 0).toLocaleString()}
              change={-0.4}
            />
          </div>

          {/* Chart + Sidebar Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Chart — takes 2/3 */}
            <div className="xl:col-span-2">
              <Chart
                data={stats?.monthlyInflow ?? []}
                thisMonthAmount={thisMonthAmount}
              />
            </div>

            {/* Right widgets — 1/3 */}
            <div className="flex flex-col gap-5">
              <QuickAddFund onSuccess={fetchStats} />
              <UpdateTarget
                currentTarget={stats?.totalFunds ?? 0}
                onSuccess={fetchStats}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

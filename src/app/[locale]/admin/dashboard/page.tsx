/** @format */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

// import Sidebar from "@/components/dashboard/Sidebar";
// import Header from "@/components/dashboard/Header";
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
  lastUpdated: string;
}

interface AdminData {
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();

  // ── Fetch Stats from backend ──────────────────
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

  // ── Auth check + initial data load ───────────
  useEffect(() => {
    const init = async () => {
      try {
        const authRes = await api.get("/api/auth/me");
        setAdmin(authRes.data);
        await fetchStats();
      } catch {
        router.push(`/${locale}/admin/login`);
      } finally {
        setPageLoading(false);
      }
    };
    init();
  }, [router, locale, fetchStats]);

  // ── Page loading spinner ──────────────────────
  if (pageLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
          <p className='text-gray-500 text-sm'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const thisMonthAmount =
    stats?.monthlyInflow?.[stats.monthlyInflow.length - 1]?.amount ?? 0;

  return (
    <div className='flex min-h-screen bg-gray-50'>
    

        <main className='flex-1 p-4 md:p-8 overflow-y-auto'>
          {/* Title row */}
          <div className='flex items-start justify-between mb-8'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                Financial Overview
              </h1>
              <p className='text-gray-400 mt-1 text-sm'>
                Manage and monitor your fundraising targets and contributions.
              </p>
            </div>
            <button className='flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition shadow-md shadow-emerald-200'>
              <Download className='w-4 h-4' />
              <span className='hidden sm:inline'>Export Report</span>
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className='mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-center justify-between'>
              <span>{error}</span>
              <button
                onClick={fetchStats}
                className='text-xs font-semibold underline ml-4'>
                Retry
              </button>
            </div>
          )}

          {/* ── 4 Stats Cards ── */}
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6'>
            {/* Card 1: Total Funds */}
            <StatsCard
              title='Total Funds'
              value={`$${(stats?.totalFunds ?? 0).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}`}
              change={5.2}
              isLoading={statsLoading}
            />

            {/* Card 2: Monthly Growth */}
            <StatsCard
              title='Monthly Growth'
              value={`${stats?.monthlyGrowth ?? 0}%`}
              change={stats?.monthlyGrowth ?? 0}
              isLoading={statsLoading}
            />

            {/* Card 3: Active Campaigns */}
            <StatsCard
              title='Active Campaigns'
              value={String(stats?.activeCampaigns ?? 0)}
              change={0}
              isLoading={statsLoading}
            />

            {/* Card 4: Total Donors */}
            <StatsCard
              title='Total Donors'
              value={(stats?.totalDonors ?? 0).toLocaleString()}
              change={-0.4}
              isLoading={statsLoading}
            />
          </div>

          {/* ── Chart + Widgets ── */}
          <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
            {/* Chart — 2/3 width */}
            <div className='xl:col-span-2'>
              <Chart
                data={stats?.monthlyInflow ?? []}
                thisMonthAmount={thisMonthAmount}
              />
            </div>

            {/* Widgets — 1/3 width */}
            <div className='flex flex-col gap-5'>
              <QuickAddFund onSuccess={fetchStats} />
              <UpdateTarget
                currentTarget={stats?.totalFunds ?? 0}
                onSuccess={fetchStats}
              />
            </div>
          </div>
        </main>
      </div>

  );
}

/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import axiosClient from "../lib/axiosClient";

export interface StatsData {
  // Backend fields
  totalFunds: number;
  monthlyGrowth: number;
  activeCampaigns: number;
  totalDonors: number;
  targetGoal: number;
  monthlyInflow: { month: string; amount: number }[];

  // Mapped aliases for homepage StatsDashboard component
  totalFundRaised: number; // mapped from totalFunds
  activeParticipants: number; // mapped from totalDonors
}

const fetchStats = async (): Promise<StatsData> => {
  const { data } = await axiosClient.get("/api/stats");

  return {
    ...data,
    totalFundRaised: data.totalFunds ?? 0,
    activeParticipants: data.totalDonors ?? 0,
  };
};

export const useStats = () => {
  return useQuery<StatsData, Error>({
    queryKey: ["stats"],
    queryFn: fetchStats,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
    retry: 1,
  });
};

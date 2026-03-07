/** @format */

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  isLoading?: boolean;
}

export default function StatsCard({
  title,
  value,
  change,
  isLoading = false,
}: StatsCardProps) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className='bg-white rounded-2xl p-6 border border-gray-100 animate-pulse'>
        <div className='h-4 bg-gray-100 rounded w-24 mb-3' />
        <div className='h-8 bg-gray-100 rounded w-32 mb-3' />
        <div className='h-6 bg-gray-100 rounded w-20' />
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow'>
      <p className='text-sm text-gray-500 font-medium mb-3'>{title}</p>
      <p className='text-3xl font-bold text-gray-900 tracking-tight'>{value}</p>
      <div className='mt-3 flex items-center gap-1.5'>
        <span
          className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
            isNeutral
              ? "bg-gray-100 text-gray-500"
              : isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
          }`}>
          {isNeutral ? (
            <Minus className='w-3 h-3' />
          ) : isPositive ? (
            <TrendingUp className='w-3 h-3' />
          ) : (
            <TrendingDown className='w-3 h-3' />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
        <span className='text-xs text-gray-400'>vs last month</span>
      </div>
    </div>
  );
}

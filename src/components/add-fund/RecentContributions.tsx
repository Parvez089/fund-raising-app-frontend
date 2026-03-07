/** @format */

import { User, Clock, BadgeCheck, DollarSign } from "lucide-react";
import { Transaction, timeAgo } from "./types";

interface RecentContributionsProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export default function RecentContributions({
  transactions,
  isLoading,
}: RecentContributionsProps) {
  return (
    <div>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        Recent Contributions
      </h3>

      {/* Loading skeleton */}
      {isLoading ? (
        <div className='space-y-3'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='bg-white rounded-2xl p-4 border border-gray-100 animate-pulse flex items-center gap-4'>
              <div className='w-10 h-10 rounded-full bg-gray-100 flex-shrink-0' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-100 rounded w-32' />
                <div className='h-3 bg-gray-100 rounded w-24' />
              </div>
              <div className='h-5 bg-gray-100 rounded w-20' />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        /* Empty state */
        <div className='bg-white rounded-2xl p-10 border border-gray-100 text-center'>
          <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3'>
            <DollarSign className='w-5 h-5 text-gray-400' />
          </div>
          <p className='text-sm text-gray-400'>
            No contributions yet. Add the first one above!
          </p>
        </div>
      ) : (
        /* Transaction list */
        <div className='space-y-3'>
          {transactions.map((tx) => (
            <div
              key={tx._id}
              className='bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:shadow-sm transition'>
              <div className='w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0'>
                <User className='w-5 h-5 text-emerald-600' />
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-gray-800 truncate'>
                  {tx.donorName}
                </p>
                <div className='flex items-center gap-1.5 mt-0.5'>
                  <span className='text-xs text-gray-400'>{tx.campaign}</span>
                  <span className='text-gray-200 text-xs'>•</span>
                  <span className='flex items-center gap-1 text-xs text-gray-400'>
                    <Clock className='w-3 h-3' />
                    {timeAgo(tx.createdAt)}
                  </span>
                </div>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='text-sm font-bold text-emerald-600'>
                  +$
                  {tx.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className='flex items-center justify-end gap-1 mt-0.5'>
                  <BadgeCheck className='w-3 h-3 text-emerald-500' />
                  <span className='text-[10px] font-bold text-emerald-500 uppercase tracking-wider'>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

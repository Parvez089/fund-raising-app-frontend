/** @format */

import { History, Download } from "lucide-react";

export interface HistoryEntry {
  _id: string;
  targetAmount: number;
  previousAmount: number;
  changedBy: string;
  changedByInitials: string;
  reason: string;
  effectiveDate: string;
  createdAt: string;
}

interface TargetHistoryTableProps {
  history: HistoryEntry[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDownloadCSV: () => void;
}

function InitialsAvatar({
  initials,
  name,
}: {
  initials: string;
  name: string;
}) {
  // Pick color based on first initial
  const colors: Record<string, string> = {
    J: "bg-blue-100 text-blue-700",
    S: "bg-purple-100 text-purple-700",
    A: "bg-amber-100 text-amber-700",
    M: "bg-pink-100 text-pink-700",
    R: "bg-red-100 text-red-700",
    P: "bg-indigo-100 text-indigo-700",
  };
  const color = colors[initials[0]] ?? "bg-emerald-100 text-emerald-700";

  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

export default function TargetHistoryTable({
  history,
  isLoading,
  hasMore,
  onLoadMore,
  onDownloadCSV,
}: TargetHistoryTableProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
        <div className='flex items-center gap-2.5'>
          <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center'>
            <History className='w-4 h-4 text-emerald-600' />
          </div>
          <h3 className='text-base font-bold text-gray-900'>Target History</h3>
        </div>
        <button
          onClick={onDownloadCSV}
          className='flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition'>
          <Download className='w-4 h-4' />
          Download CSV
        </button>
      </div>

      {/* Table */}
      {isLoading && history.length === 0 ? (
        <div className='p-6 space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center gap-4 animate-pulse'>
              <div className='h-4 bg-gray-100 rounded w-24' />
              <div className='h-4 bg-gray-100 rounded w-28' />
              <div className='h-4 bg-gray-100 rounded w-24' />
              <div className='h-4 bg-gray-100 rounded flex-1' />
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className='p-12 text-center'>
          <div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3'>
            <History className='w-5 h-5 text-gray-400' />
          </div>
          <p className='text-sm text-gray-400'>
            No target changes recorded yet.
          </p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className='grid grid-cols-4 px-6 py-3 bg-gray-50 border-b border-gray-100'>
            {["DATE", "TARGET AMOUNT", "CHANGED BY", "REASON"].map((col) => (
              <p
                key={col}
                className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>
                {col}
              </p>
            ))}
          </div>

          {/* Rows */}
          <div className='divide-y divide-gray-50'>
            {history.map((entry) => (
              <div
                key={entry._id}
                className='grid grid-cols-4 px-6 py-4 hover:bg-gray-50 transition items-center'>
                {/* Date */}
                <p className='text-sm text-gray-600'>
                  {new Date(entry.effectiveDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>

                {/* Amount */}
                <p className='text-sm font-bold text-gray-900'>
                  $
                  {entry.targetAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </p>

                {/* Changed by */}
                <div className='flex items-center gap-2'>
                  <InitialsAvatar
                    initials={entry.changedByInitials}
                    name={entry.changedBy}
                  />
                  <span className='text-sm text-gray-700 truncate'>
                    {entry.changedBy}
                  </span>
                </div>

                {/* Reason */}
                <p className='text-sm text-gray-400 truncate'>{entry.reason}</p>
              </div>
            ))}
          </div>

          {/* Load more / View full audit */}
          <div className='px-6 py-4 border-t border-gray-100 text-center'>
            {hasMore ? (
              <button
                onClick={onLoadMore}
                className='text-sm font-semibold text-gray-500 hover:text-emerald-600 transition'>
                View Full Audit Log
              </button>
            ) : (
              <p className='text-xs text-gray-300'>All records shown</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

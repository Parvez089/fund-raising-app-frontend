/** @format */

interface GoalStatusCardProps {
  targetGoal: number;
  totalFunds: number;
  remaining: number;
  progressPercent: number;
  lastUpdated: string | null;
  isLoading: boolean;
}

export default function GoalStatusCard({
  targetGoal,
  remaining,
  progressPercent,
  lastUpdated,
  isLoading,
}: GoalStatusCardProps) {
  // Format date dynamically from last target update
  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  if (isLoading) {
    return (
      <div className='bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-6 animate-pulse'>
        <div className='flex flex-col md:flex-row md:items-center gap-8'>
          <div className='space-y-3'>
            <div className='h-4 bg-gray-100 rounded w-32' />
            <div className='h-10 bg-gray-100 rounded w-48' />
            <div className='h-6 bg-gray-100 rounded w-28' />
          </div>
          <div className='flex-1 space-y-3'>
            <div className='h-4 bg-gray-100 rounded w-24 ml-auto' />
            <div className='h-4 bg-gray-100 rounded w-full' />
            <div className='h-4 bg-gray-100 rounded w-64' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-6'>
      <div className='flex flex-col md:flex-row md:items-center gap-8'>
        {/* Left — current goal */}
        <div className='flex-shrink-0'>
          <p className='text-sm text-gray-400 mb-2'>Current Goal Status</p>
          <p className='text-4xl font-bold text-gray-900 mb-3'>
            ${targetGoal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider border border-emerald-100'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500' />
            Active Target
          </span>
        </div>

        {/* Divider */}
        <div className='hidden md:block w-px h-20 bg-gray-100' />

        {/* Right — progress */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-3'>
            <span className='text-sm font-medium text-gray-600'>
              Overall Progress
            </span>
            <span className='text-lg font-bold text-emerald-600'>
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className='h-3 bg-gray-100 rounded-full overflow-hidden mb-3'>
            <div
              className='h-full bg-emerald-500 rounded-full transition-all duration-700'
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* ✅ Dynamic date from backend */}
          <p className='text-sm text-gray-500'>
            <span className='font-semibold text-gray-800'>
              ${remaining.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>{" "}
            remaining to reach goal. Started on{" "}
            <span className='font-semibold text-gray-700'>{formattedDate}</span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

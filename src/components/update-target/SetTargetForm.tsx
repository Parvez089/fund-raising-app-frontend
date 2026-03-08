/** @format */

import { DollarSign, Target } from "lucide-react";

interface SetTargetFormProps {
  newTarget: string;
  effectiveDate: string;
  reason: string;
  loading: boolean;
  error: string;
  onNewTargetChange: (v: string) => void;
  onEffectiveDateChange: (v: string) => void;
  onReasonChange: (v: string) => void;
  onSubmit: () => void;
}

export default function SetTargetForm({
  newTarget,
  effectiveDate,
  reason,
  loading,
  error,
  onNewTargetChange,
  onEffectiveDateChange,
  onReasonChange,
  onSubmit,
}: SetTargetFormProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit'>
      {/* Heading */}
      <div className='flex items-center gap-2.5 mb-6'>
        <div className='w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center'>
          <Target className='w-4 h-4 text-emerald-600' />
        </div>
        <h3 className='text-base font-bold text-gray-900'>Set New Target</h3>
      </div>

      <div className='space-y-4'>
        {/* Amount */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            New Target Amount (USD)
          </label>
          <div className='relative'>
            <DollarSign className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='number'
              value={newTarget}
              onChange={(e) => onNewTargetChange(e.target.value)}
              placeholder='0.00'
              min='0'
              step='0.01'
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                error
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
          </div>
          {error && <p className='text-xs text-red-500 mt-1'>{error}</p>}
        </div>

        {/* Effective Date */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Effective Date
          </label>
          <input
            type='date'
            value={effectiveDate}
            onChange={(e) => onEffectiveDateChange(e.target.value)}
            className='w-full px-4 py-3 rounded-xl text-sm text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
          />
        </div>

        {/* Reason */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Reason for Change
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder='Brief explanation for updating the target...'
            rows={4}
            className='w-full px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none'
          />
        </div>

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed'>
          <Target className='w-4 h-4' />
          {loading ? "Updating..." : "Update Target"}
        </button>
      </div>
    </div>
  );
}

/** @format */

import {
  User,
  DollarSign,
  Megaphone,
  Calendar,
  AlignLeft,
  CheckCircle2,
} from "lucide-react";
import { CAMPAIGNS } from "./types";

interface ContributionFormProps {
  donorName: string;
  amount: string;
  campaign: string;
  date: string;
  note: string;
  loading: boolean;
  errors: Record<string, string>;
  onDonorNameChange: (v: string) => void;
  onAmountChange: (v: string) => void;
  onCampaignChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onNoteChange: (v: string) => void;
  onSubmit: () => void;
  onDiscard: () => void;
}

export default function ContributionForm({
  donorName,
  amount,
  campaign,
  date,
  note,
  loading,
  errors,
  onDonorNameChange,
  onAmountChange,
  onCampaignChange,
  onDateChange,
  onNoteChange,
  onSubmit,
  onDiscard,
}: ContributionFormProps) {
  return (
    <div className='bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm mb-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5'>
        {/* Contributor Name */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Contributor Name
          </label>
          <div className='relative'>
            <User className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={donorName}
              onChange={(e) => onDonorNameChange(e.target.value)}
              placeholder='e.g. Robert Fox'
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.donorName
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
          </div>
          {errors.donorName && (
            <p className='text-xs text-red-500 mt-1'>{errors.donorName}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Amount (USD)
          </label>
          <div className='relative'>
            <DollarSign className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='number'
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder='0.00'
              min='0'
              step='0.01'
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.amount
                  ? "border-red-300 bg-red-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            />
          </div>
          {errors.amount && (
            <p className='text-xs text-red-500 mt-1'>{errors.amount}</p>
          )}
        </div>

        {/* Campaign */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Campaign Selection
          </label>
          <div className='relative'>
            <Megaphone className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <select
              value={campaign}
              onChange={(e) => onCampaignChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition appearance-none cursor-pointer ${
                errors.campaign
                  ? "border-red-300 bg-red-50 text-gray-800"
                  : "border-gray-200 bg-gray-50 text-gray-800"
              } ${!campaign ? "text-gray-400" : ""}`}>
              <option value=''>Select a campaign</option>
              {CAMPAIGNS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
          {errors.campaign && (
            <p className='text-xs text-red-500 mt-1'>{errors.campaign}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Date of Contribution
          </label>
          <div className='relative'>
            <Calendar className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='date'
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className='w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
            />
          </div>
        </div>

        {/* Note — full width */}
        <div className='md:col-span-2'>
          <label className='text-sm font-medium text-gray-700 block mb-2'>
            Optional Message / Note
          </label>
          <div className='relative'>
            <AlignLeft className='absolute left-3.5 top-3.5 w-4 h-4 text-gray-400' />
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder='Add any specific details or special instructions...'
              rows={4}
              className='w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none'
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-100'>
        <button
          onClick={onDiscard}
          className='px-6 py-2.5 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition'>
          Discard
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className='flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed'>
          <CheckCircle2 className='w-4 h-4' />
          {loading ? "Processing..." : "Confirm Deposit"}
        </button>
      </div>
    </div>
  );
}

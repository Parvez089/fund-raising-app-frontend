/** @format */
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";
const CAMPAIGNS = [
  "renovation fund",

];

interface QuickAddFundProps {
  onSuccess: () => void;
}

export default function QuickAddFund({ onSuccess }: QuickAddFundProps) {
  const [amount, setAmount] = useState("");
  const [campaign, setCampaign] = useState(CAMPAIGNS[0]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setMessage({ text: "Please enter a valid amount.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/api/stats/fund", {
        amount: Number(amount),
        campaign,
      });

      setMessage({ text: "Fund added successfully!", type: "success" });
      setAmount("");
      onSuccess();
    } catch (error) {
      setMessage({
        text: getErrorMessage(error, "Failed to add fund."),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-100'>
      <h3 className='font-bold text-gray-900 mb-5'>Quick Add Fund</h3>

      <div className='space-y-4'>
        {/* Amount */}
        <div>
          <label className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>
            Amount (USD)
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>
              $
            </span>
            <input
              type='number'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0.00'
              min='0'
              step='0.01'
              className='w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
            />
          </div>
        </div>

        {/* Campaign */}
        <div>
          <label className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>
            Campaign
          </label>
          <select
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition bg-white cursor-pointer'>
            {CAMPAIGNS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-xs font-medium px-3 py-2 rounded-lg ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}>
            {message.text}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='w-full py-3 bg-emerald-50 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-100 transition disabled:opacity-50 disabled:cursor-not-allowed'>
          {loading ? "Processing..." : "Confirm Deposit"}
        </button>
      </div>
    </div>
  );
}

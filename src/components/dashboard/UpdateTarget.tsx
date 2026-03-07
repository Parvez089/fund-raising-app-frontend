/** @format */
"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

interface UpdateTargetProps {
  currentTarget: number;
  onSuccess: () => void;
}

export default function UpdateTarget({
  currentTarget,
  onSuccess,
}: UpdateTargetProps) {
  const [target, setTarget] = useState(currentTarget.toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleUpdate = async () => {
    if (!target || isNaN(Number(target)) || Number(target) <= 0) {
      setMessage({ text: "Please enter a valid target.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ✅ Axios - no .ok or .json() needed
      await api.put("/api/stats/target", { targetGoal: Number(target) });

      setMessage({ text: "Target updated successfully!", type: "success" });
      onSuccess();
    } catch (error) {
      setMessage({
        text: getErrorMessage(error, "Failed to update target."),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min(
    Math.round((currentTarget / Number(target || 1)) * 100),
    100,
  );

  return (
    <div className='bg-white rounded-2xl p-6 border border-gray-100'>
      <h3 className='font-bold text-gray-900 mb-5'>Update Goal</h3>

      <div className='space-y-4'>
        {/* Input */}
        <div>
          <label className='text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5'>
            New Target Goal
          </label>
          <div className='relative'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>
             ৳
            </span>
            <input
              type='number'
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              min='1'
              className='w-full pl-7 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
            />
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className='flex justify-between text-xs text-gray-400 mb-1'>
            <span>Current progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-emerald-500 rounded-full transition-all duration-500'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
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

        {/* Button */}
        <button
          onClick={handleUpdate}
          disabled={loading}
          className='w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed'>
          {loading ? "Updating..." : "Update Target"}
        </button>
      </div>
    </div>
  );
}

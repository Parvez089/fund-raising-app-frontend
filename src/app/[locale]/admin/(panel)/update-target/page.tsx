/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

import GoalStatusCard from "@/components/update-target/GoalStatusCard";
import SetTargetForm from "@/components/update-target/SetTargetForm";
import TargetHistoryTable from "@/components/update-target/TargetHistoryTable";
import type { HistoryEntry } from "@/components/update-target/Types";
import axiosClient from "@/lib/axiosClient";

interface TargetData {
  targetGoal: number;
  totalFunds: number;
  remaining: number;
  progressPercent: number;
  lastUpdated: string | null;
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

export default function UpdateTargetPage() {
  // ── Target data ─────────────────────────────────
  const [targetData, setTargetData] = useState<TargetData | null>(null);
  const [targetLoading, setTargetLoading] = useState(true);

  // ── Form state ───────────────────────────────────
  const [newTarget, setNewTarget] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ── History ──────────────────────────────────────
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyPage, setHistoryPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // ── Toast ────────────────────────────────────────
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  };

  // ── Fetch current target ─────────────────────────
  const fetchTarget = useCallback(async () => {
    setTargetLoading(true);
    try {
      const res = await api.get("/api/target");
      setTargetData(res.data);
    } catch {
      // fallback
    } finally {
      setTargetLoading(false);
    }
  }, []);

  // ── Fetch history ────────────────────────────────
  const fetchHistory = useCallback(async (page = 1, append = false) => {
    setHistoryLoading(true);
    try {
      const res = await api.get(`/api/target/history?page=${page}&limit=3`);
      const data = res.data;
      if (append) {
        setHistory((prev) => [...prev, ...data.history]);
      } else {
        setHistory(data.history ?? []);
      }
      setHasMore(data.hasMore ?? false);
      setHistoryPage(page);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTarget();
    fetchHistory(1);
  }, [fetchTarget, fetchHistory]);

  // ── Submit ───────────────────────────────────────
  const handleSubmit = async () => {
    if (!newTarget || isNaN(Number(newTarget)) || Number(newTarget) <= 0) {
      setFormError("Please enter a valid target amount.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      await api.put("/api/target", {
        targetGoal: Number(newTarget),
        reason: reason.trim() || "No reason provided",
        effectiveDate: effectiveDate || new Date().toISOString(),
      });
      showToast("Target updated successfully!", "success");
      setNewTarget("");
      setEffectiveDate("");
      setReason("");
      // Refresh both
      fetchTarget();
      fetchHistory(1, false);
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to update target."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Download CSV ─────────────────────────────────
  const handleDownloadCSV = async () => {
    try {
      const res = await axiosClient.get("/api/target/history/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `target-history-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      showToast("Failed to download CSV.", "error");
    }
  };

  return (
    <div className='p-6 md:p-8'>
      <div className='max-w-5xl mx-auto'>
        {/* Page heading */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Update Fundraising Target
          </h2>
          <p className='text-gray-400 mt-1 text-sm'>
            Dashboard /{" "}
            <span className='text-emerald-600 font-medium'>Update Target</span>
          </p>
        </div>

        {/* Goal status + progress bar */}
        <GoalStatusCard
          targetGoal={targetData?.targetGoal ?? 0}
          totalFunds={targetData?.totalFunds ?? 0}
          remaining={targetData?.remaining ?? 0}
          progressPercent={targetData?.progressPercent ?? 0}
          lastUpdated={targetData?.lastUpdated ?? null}
          isLoading={targetLoading}
        />

        {/* Form + History side by side */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Form — narrower */}
          <div className='lg:col-span-2'>
            <SetTargetForm
              newTarget={newTarget}
              effectiveDate={effectiveDate}
              reason={reason}
              loading={submitting}
              error={formError}
              onNewTargetChange={setNewTarget}
              onEffectiveDateChange={setEffectiveDate}
              onReasonChange={setReason}
              onSubmit={handleSubmit}
            />
          </div>

          {/* History table — wider */}
          <div className='lg:col-span-3'>
            <TargetHistoryTable
              history={history}
              isLoading={historyLoading}
              hasMore={hasMore}
              onLoadMore={() => fetchHistory(historyPage + 1, true)}
              onDownloadCSV={handleDownloadCSV}
            />
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white min-w-[280px] ${
            toast.type === "success" ? "bg-gray-900" : "bg-red-600"
          }`}>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.type === "success" ? "bg-emerald-500" : "bg-red-400"
            }`}>
            <svg
              className='w-3.5 h-3.5 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <p className='text-sm font-bold flex-1'>{toast.message}</p>
          <button
            onClick={() => setToast((t) => ({ ...t, show: false }))}
            className='text-gray-400 hover:text-white transition'>
            <svg
              className='w-4 h-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
/** @format */
"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/getErrorMessage";

import ContributionForm from "@/components/add-fund/ContributionForm";
import RecentContributions from "@/components/add-fund/RecentContributions";
import FundToast from "@/components/add-fund/FundToast";

import type { Transaction, ToastState } from "@/components/add-fund/types";

export default function AddFundPage() {
  // ── Form state ──────────────────────────────────
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [campaign, setCampaign] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Transactions ────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);

  // ── Toast ───────────────────────────────────────
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    sub: "",
    type: "success",
  });

  const showToast = (
    message: string,
    sub: string,
    type: "success" | "error",
  ) => {
    setToast({ show: true, message, sub, type });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000);
  };

  // ── Fetch recent transactions ───────────────────
  const fetchTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const res = await api.get("/api/stats/transactions?limit=2");
      setTransactions(res.data.transactions ?? []);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ── Validate form ───────────────────────────────
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!donorName.trim()) e.donorName = "Contributor name is required";
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!campaign) e.campaign = "Please select a campaign";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/stats/fund", {
        amount: Number(amount),
        campaign,
        donorName: donorName.trim(),
        note: note.trim(),
      });
      showToast(
        "Fund added successfully!",
        "The dashboard analytics will update shortly.",
        "success",
      );
      setDonorName("");
      setAmount("");
      setCampaign("");
      setDate("");
      setNote("");
      setErrors({});
      fetchTransactions();
    } catch (err) {
      showToast(getErrorMessage(err, "Failed to add fund."), "", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Discard ─────────────────────────────────────
  const handleDiscard = () => {
    setDonorName("");
    setAmount("");
    setCampaign("");
    setDate("");
    setNote("");
    setErrors({});
  };

  return (
    <div className='p-6 md:p-8'>
      <div className='max-w-3xl mx-auto'>
        {/* Heading */}
        <div className='mb-8'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Register Contribution
          </h2>
          <p className='text-gray-400 mt-1 text-sm'>
            Input the transaction details to update the campaign balance and
            records.
          </p>
        </div>

        {/* Form */}
        <ContributionForm
          donorName={donorName}
          amount={amount}
          campaign={campaign}
          date={date}
          note={note}
          loading={loading}
          errors={errors}
          onDonorNameChange={setDonorName}
          onAmountChange={setAmount}
          onCampaignChange={setCampaign}
          onDateChange={setDate}
          onNoteChange={setNote}
          onSubmit={handleSubmit}
          onDiscard={handleDiscard}
        />

        {/* Recent contributions */}
        <RecentContributions
          transactions={transactions}
          isLoading={txLoading}
        />
      </div>

      {/* Toast */}
      <FundToast
        toast={toast}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
    </div>
  );
}

/** @format */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Contribution } from "../../app/[locale]/admin/(panel)/manage-contributions/types";

interface Props {
  item:    Contribution;
  onClose: () => void;
  onSave:  (updated: Partial<Contribution>) => Promise<void>;
}

// Convert ISO string → "YYYY-MM-DD" for <input type="date">
function toDateInput(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toISOString().split("T")[0];
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-200";

export default function EditModal({ item, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    donorName: item.donorName,
    campaign:  item.campaign,
    amount:    String(item.amount),
    status:    item.status,
    note:      item.note,
    date:      toDateInput(item.createdAt),
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    await onSave({
      donorName: form.donorName,
      campaign:  form.campaign,
      amount:    Number(form.amount),
      status:    form.status as Contribution["status"],
      note:      form.note,
      // send as ISO string so backend stores it correctly
      createdAt: form.date ? new Date(form.date).toISOString() : item.createdAt,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Edit Contribution</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Donor Name */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Donor Name
            </label>
            <input
              value={form.donorName}
              onChange={(e) => set("donorName", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Campaign */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Campaign
            </label>
            <input
              value={form.campaign}
              onChange={(e) => set("campaign", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Amount (৳)
            </label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
              <input
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={inputCls}
            >
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">
              Note
            </label>
            <textarea
              value={form.note}
              rows={2}
              onChange={(e) => set("note", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>

        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
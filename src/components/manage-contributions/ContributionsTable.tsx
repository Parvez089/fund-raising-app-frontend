/** @format */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Contribution, STATUS_STYLES, avatarColor, fmtDate } from "../../app/[locale]/admin/(panel)/manage-contributions/types";

interface Props {
  contributions: Contribution[];
  loading:       boolean;
  bulkMode:      boolean;
  selected:      string[];
  onToggleAll:   () => void;
  onToggleOne:   (id: string) => void;
  onEdit:        (item: Contribution) => void;
  onDelete:      (ids: string[]) => void;
  LIMIT:         number;
}

export default function ContributionsTable({
  contributions, loading, bulkMode, selected,
  onToggleAll, onToggleOne, onEdit, onDelete, LIMIT,
}: Props) {
  const allSelected =
    contributions.length > 0 && selected.length === contributions.length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-50">
            {bulkMode && (
              <th className="pl-5 py-3 w-8">
                <button
                  onClick={onToggleAll}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                    allSelected
                      ? "bg-emerald-600 border-emerald-600"
                      : "border-gray-200 hover:border-emerald-400"
                  }`}
                >
                  {allSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </button>
              </th>
            )}
            {["Donor Name", "Campaign", "Amount", "Date", "Status", "Actions"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-[10px] font-black text-gray-300 uppercase tracking-widest"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Loading skeleton */}
          {loading &&
            Array.from({ length: LIMIT }).map((_, i) => (
              <tr key={i} className="border-b border-gray-50 animate-pulse">
                {bulkMode && (
                  <td className="pl-5 py-4">
                    <div className="w-4 h-4 bg-gray-100 rounded" />
                  </td>
                )}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-full" />
                    <div className="h-3 bg-gray-100 rounded w-24" />
                  </div>
                </td>
                <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-32" /></td>
                <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-16" /></td>
                <td className="px-4 py-4"><div className="h-3 bg-gray-100 rounded w-20" /></td>
                <td className="px-4 py-4"><div className="h-5 bg-gray-100 rounded-full w-16" /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                    <div className="w-7 h-7 bg-gray-100 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}

          {/* Empty state */}
          {!loading && contributions.length === 0 && (
            <tr>
              <td
                colSpan={bulkMode ? 7 : 6}
                className="py-16 text-center text-sm text-gray-400"
              >
                No contributions found.
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading && (
            <AnimatePresence>
              {contributions.map((c, i) => {
                const s          = STATUS_STYLES[c.status] ?? STATUS_STYLES.success;
                const isSelected = selected.includes(c._id);

                return (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                      isSelected ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    {bulkMode && (
                      <td className="pl-5 py-4">
                        <button
                          onClick={() => onToggleOne(c._id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${
                            isSelected
                              ? "bg-emerald-600 border-emerald-600"
                              : "border-gray-200 hover:border-emerald-400"
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                        </button>
                      </td>
                    )}

                    {/* Donor */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor(c.donorName)}`}
                        >
                          {c.initials}
                        </div>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                          {c.donorName}
                        </span>
                      </div>
                    </td>

                    {/* Campaign */}
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {c.campaign}
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-black text-gray-900">
                        ৳{c.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                      {fmtDate(c.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${s.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onEdit(c)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete([c._id])}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          )}
        </tbody>
      </table>
    </div>
  );
}
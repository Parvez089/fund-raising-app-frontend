/** @format */
"use client";

import { Trash2 } from "lucide-react";

interface Props {
  bulkMode:     boolean;
  selectedCount: number;
  total:        number;
  page:         number;
  limit:        number;
  onToggleBulk: () => void;
  onBulkDelete: () => void;
}

export default function BulkActionsBar({
  bulkMode, selectedCount, total, page, limit,
  onToggleBulk, onBulkDelete,
}: Props) {
  const from = Math.min((page - 1) * limit + 1, total);
  const to   = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
      <div className="flex items-center gap-3">
        {/* Toggle switch */}
        <button
          onClick={onToggleBulk}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            bulkMode ? "bg-emerald-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              bulkMode ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="text-xs font-semibold text-gray-400">Bulk Actions</span>

        {selectedCount > 0 && (
          <button
            onClick={onBulkDelete}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition"
          >
            <Trash2 className="w-3 h-3" />
            Delete {selectedCount}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">
        Showing {from}–{to} of {total} results
      </p>
    </div>
  );
}
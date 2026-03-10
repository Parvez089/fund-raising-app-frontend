/** @format */
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages:  number;
  onPage:      (page: number) => void;
}

function buildPages(current: number, total: number): (number | string)[] {
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | string)[] = [1];
  if (current > 3) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPage }: Props) {
  if (totalPages <= 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      {/* Prev */}
      <button
        onClick={() => onPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Page numbers */}
      {buildPages(currentPage, totalPages).map((p, i) =>
        p === "..." ? (
          <span key={`d-${i}`} className="text-gray-300 text-xs px-1">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(Number(p))}
            className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
              currentPage === p
                ? "bg-emerald-600 text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
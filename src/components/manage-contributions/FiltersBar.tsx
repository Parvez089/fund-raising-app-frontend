/** @format */
"use client";

import { Search, Filter } from "lucide-react";

const STATUS_TABS = [
  { key: "all",     label: "All Status", cls: "bg-emerald-600 text-white"                               },
  { key: "success", label: "Success",    cls: "bg-emerald-50 text-emerald-600 border border-emerald-200" },
  { key: "pending", label: "Pending",    cls: "bg-amber-50 text-amber-600 border border-amber-200"       },
  { key: "flagged", label: "Flagged",    cls: "bg-red-50 text-red-500 border border-red-200"             },
];

interface Props {
  search:    string;
  status:    string;
  onSearch:  (val: string) => void;
  onStatus:  (val: string) => void;
}

export default function FiltersBar({ search, status, onSearch, onStatus }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">

        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            defaultValue={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by donor, campaign, or date..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {/* Filter button */}
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-500 hover:bg-gray-100 transition">
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* Status pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 mr-1">STATUS:</span>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onStatus(tab.key)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                status === tab.key
                  ? tab.cls
                  : "bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
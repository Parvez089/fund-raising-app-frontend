/** @format */
"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

import axiosClient from "@/lib/axiosClient";
import { Contribution } from "./types";

import FiltersBar        from "../../../../../components/manage-contributions/FiltersBar";
import BulkActionsBar    from "../../../../../components/manage-contributions/BulkActionsBar";
import ContributionsTable from "../../../../../components/manage-contributions/ContributionsTable";
import Pagination        from "../../../../../components/manage-contributions/Pagination";
import EditModal         from "../../../../../components/manage-contributions/EditModal";
import DeleteModal       from "../../../../../components/manage-contributions/DeleteModal";
import Toast             from "../../../../../components/manage-contributions/Toast";

const LIMIT = 8;

// ── Inner page (needs useSearchParams → must be inside Suspense) ──────────────
function ManageContributionsInner() {
  const router       = useRouter();
  const pathname     = usePathname();
  const locale       = useLocale();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "all";
  const urlPage   = Math.max(1, Number(searchParams.get("page")) || 1);

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [total,         setTotal]         = useState(0);
  const [totalPages,    setTotalPages]    = useState(1);
  const [selected,      setSelected]      = useState<string[]>([]);
  const [bulkMode,      setBulkMode]      = useState(false);
  const [editItem,      setEditItem]      = useState<Contribution | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<string[] | null>(null);
  const [toast,         setToast]         = useState("");

  // ── URL sync helper ───────────────────────────────────────────────────────
  const updateURL = useCallback(
    (s: string, st: string, p: number) => {
      const params = new URLSearchParams();
      if (s)        params.set("search", s);
      if (st !== "all") params.set("status", st);
      if (p > 1)    params.set("page", String(p));
      router.push(
        `${pathname}${params.toString() ? `?${params}` : ""}`,
        { scroll: false }
      );
    },
    [router, pathname]
  );

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page:   String(urlPage),
        limit:  String(LIMIT),
        status: urlStatus,
        ...(urlSearch && { search: urlSearch }),
      });
      const res = await axiosClient.get(`/api/contributions?${params}`);
      setContributions(res.data.contributions ?? []);
      setTotal(res.data.total ?? 0);
      setTotalPages(res.data.totalPages ?? 1);
    } catch {
      setContributions([]);
    } finally {
      setLoading(false);
    }
  }, [urlPage, urlStatus, urlSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Clear selection when filters/page change
  useEffect(() => { setSelected([]); }, [urlPage, urlStatus, urlSearch]);

  // ── Toast helper ──────────────────────────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleEdit = async (updated: Partial<Contribution>) => {
    if (!editItem) return;
    await axiosClient.put(`/api/contributions/${editItem._id}`, updated);
    setEditItem(null);
    showToast("Contribution updated.");
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.length === 1) {
      await axiosClient.delete(`/api/contributions/${deleteTarget[0]}`);
    } else {
      await axiosClient.delete("/api/contributions/bulk", {
        data: { ids: deleteTarget },
      });
    }
    setDeleteTarget(null);
    setSelected([]);
    showToast(
      `${deleteTarget.length} contribution${deleteTarget.length > 1 ? "s" : ""} deleted.`
    );
    fetchData();
  };

  const toggleOne = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleAll = () =>
    setSelected(
      selected.length === contributions.length
        ? []
        : contributions.map((c) => c._id)
    );

  const toggleBulk = () => {
    setBulkMode((v) => !v);
    setSelected([]);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#f5f6fa]">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1">
            Manage Contributions
          </h1>
          <p className="text-sm text-gray-400 max-w-md">
            Oversee donor activities, adjust transaction statuses, and maintain
            financial integrity for all active campaigns.
          </p>
        </div>
        <button
          onClick={() => router.push(`/${locale}/admin/add-fund`)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm shadow-emerald-200 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Contribution</span>
        </button>
      </div>

      {/* Filters */}
      <FiltersBar
        search={urlSearch}
        status={urlStatus}
        onSearch={(val) => updateURL(val, urlStatus, 1)}
        onStatus={(val) => updateURL(urlSearch, val, 1)}
      />

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <BulkActionsBar
          bulkMode={bulkMode}
          selectedCount={selected.length}
          total={total}
          page={urlPage}
          limit={LIMIT}
          onToggleBulk={toggleBulk}
          onBulkDelete={() => setDeleteTarget(selected)}
        />

        <ContributionsTable
          contributions={contributions}
          loading={loading}
          bulkMode={bulkMode}
          selected={selected}
          onToggleAll={toggleAll}
          onToggleOne={toggleOne}
          onEdit={setEditItem}
          onDelete={setDeleteTarget}
          LIMIT={LIMIT}
        />

        {/* Footer: rows count + pagination */}
        {!loading && totalPages > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
            <span className="text-xs text-gray-400">{LIMIT} rows per page</span>
            <Pagination
              currentPage={urlPage}
              totalPages={totalPages}
              onPage={(p) => updateURL(urlSearch, urlStatus, p)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editItem && (
          <EditModal
            key="edit"
            item={editItem}
            onClose={() => setEditItem(null)}
            onSave={handleEdit}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            key="delete"
            count={deleteTarget.length}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast key="toast" message={toast} />}
      </AnimatePresence>
    </div>
  );
}

// ── Export wrapped in Suspense (required for useSearchParams) ─────────────────
export default function ManageContributionsPage() {
  return (
    <Suspense>
      <ManageContributionsInner />
    </Suspense>
  );
}
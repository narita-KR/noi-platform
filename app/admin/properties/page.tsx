"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ============================================
   Types
   ============================================ */

interface Property {
  id: number;
  title: string;
  category: string;
  price: string;
  priceNum: number;
  yield: string;
  yieldNum: number;
  location: string;
  status: "公開中" | "下書き" | "非公開";
  registeredAt: string;
}

/* ============================================
   Mock Data (20 properties)
   ============================================ */

const CATEGORIES = [
  "区分マンション",
  "一棟アパート",
  "一棟マンション",
  "一棟ビル",
  "店舗・事務所",
  "土地",
];

const LOCATIONS = [
  "東京都港区赤坂",
  "東京都大田区上池台",
  "大阪府大阪市中央区",
  "神奈川県横浜市西区",
  "福岡県福岡市博多区",
  "愛知県名古屋市中区",
  "北海道札幌市中央区",
  "京都府京都市左京区",
  "兵庫県神戸市中央区",
  "埼玉県さいたま市大宮区",
];

const STATUSES: Property["status"][] = ["公開中", "下書き", "非公開"];

const MOCK_PROPERTIES: Property[] = Array.from({ length: 20 }, (_, i) => ({
  id: 10001 + i,
  title: `${LOCATIONS[i % LOCATIONS.length].slice(0, 6)} ${CATEGORIES[i % CATEGORIES.length]}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: `${((i + 1) * 3500 + 2000).toLocaleString()}万円`,
  priceNum: (i + 1) * 3500 + 2000,
  yield: `${(4.2 + (i % 8) * 0.4).toFixed(1)}%`,
  yieldNum: 4.2 + (i % 8) * 0.4,
  location: LOCATIONS[i % LOCATIONS.length],
  status: STATUSES[i % 3],
  registeredAt: `2026-01-${String(29 - (i % 28)).padStart(2, "0")}`,
}));

const TOTAL_COUNT = 13538;

/* ============================================
   Helpers
   ============================================ */

function statusBadge(status: Property["status"]) {
  switch (status) {
    case "公開中":
      return "bg-green-100 text-green-700";
    case "下書き":
      return "bg-yellow-100 text-yellow-700";
    case "非公開":
      return "bg-gray-100 text-gray-600";
  }
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("すべて");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [sortBy, setSortBy] = useState("registeredAt");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* --- Filtering & Sorting --- */
  const filtered = MOCK_PROPERTIES.filter((p) => {
    if (
      searchQuery &&
      !p.title.includes(searchQuery) &&
      !p.location.includes(searchQuery)
    )
      return false;
    if (categoryFilter !== "すべて" && p.category !== categoryFilter)
      return false;
    if (statusFilter !== "すべて" && p.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "price") return b.priceNum - a.priceNum;
    if (sortBy === "yield") return b.yieldNum - a.yieldNum;
    return b.registeredAt.localeCompare(a.registeredAt);
  });

  /* --- Selection --- */
  const allSelected =
    filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* --- Actions --- */
  const handleDelete = (id: number) => {
    if (confirm(`物件 ID:${id} を削除してもよろしいですか？`)) {
      console.log("Delete property:", id);
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction) return;
    if (selectedIds.size === 0) {
      alert("物件を選択してください");
      return;
    }
    if (
      confirm(
        `選択した ${selectedIds.size} 件の物件を「${bulkAction}」しますか？`
      )
    ) {
      console.log("Bulk action:", bulkAction, [...selectedIds]);
      setSelectedIds(new Set());
      setBulkAction("");
    }
  };

  /* --- Pagination --- */
  const totalPages = Math.ceil(TOTAL_COUNT / 20);
  const startItem = (currentPage - 1) * 20 + 1;
  const endItem = Math.min(currentPage * 20, TOTAL_COUNT);

  const pageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = totalPages;
    const cur = currentPage;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push("...");
      for (
        let i = Math.max(2, cur - 1);
        i <= Math.min(total - 1, cur + 1);
        i++
      ) {
        pages.push(i);
      }
      if (cur < total - 2) pages.push("...");
      pages.push(total);
    }
    return pages;
  };

  const selectCls =
    "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-5">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">物件管理</h1>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          新規物件登録
        </Link>
      </div>

      {/* ===== 2. FILTER BAR ===== */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="物件名・住所で検索"
            className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Category */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={selectCls}
        >
          <option>すべて</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={selectCls}
        >
          <option>すべて</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={selectCls}
        >
          <option value="registeredAt">登録日</option>
          <option value="price">価格</option>
          <option value="yield">利回り</option>
        </select>
      </div>

      {/* ===== 3. TABLE CARD ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ===== 5. BULK ACTIONS ===== */}
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            すべて選択
          </label>

          {selectedIds.size > 0 && (
            <span className="text-xs font-medium text-blue-600">
              {selectedIds.size}件選択中
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500">選択した物件を:</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className={selectCls}
            >
              <option value="">選択</option>
              <option value="公開する">公開する</option>
              <option value="非公開にする">非公開にする</option>
              <option value="削除する">削除する</option>
            </select>
            <button
              type="button"
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedIds.size === 0}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              実行
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="w-10 px-5 py-3" />
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  画像
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  物件名
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  カテゴリー
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  価格
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  利回り
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  所在地
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  ステータス
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  登録日
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className={`border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 ${
                    selectedIds.has(p.id) ? "bg-blue-50/50" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                    />
                  </td>

                  {/* ID */}
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                    {p.id}
                  </td>

                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="flex h-15 w-20 items-center justify-center rounded bg-gray-200 text-[10px] text-gray-400">
                      物件画像
                    </div>
                  </td>

                  {/* Title */}
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                    {p.title}
                  </td>

                  {/* Category */}
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {p.category}
                  </td>

                  {/* Price */}
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800">
                    {p.price}
                  </td>

                  {/* Yield */}
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-red-600">
                    {p.yield}
                  </td>

                  {/* Location */}
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {p.location}
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {p.registeredAt}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 no-underline transition-colors hover:bg-blue-100"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        編集
                      </Link>
                      <Link
                        href={`/properties/${p.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 no-underline transition-colors hover:bg-gray-200"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        プレビュー
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-5 py-12 text-center text-sm text-gray-400"
                  >
                    条件に一致する物件がありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== 4. PAGINATION ===== */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{startItem}</span>–
            <span className="font-medium text-gray-700">{endItem}</span> /{" "}
            <span className="font-medium text-gray-700">
              {TOTAL_COUNT.toLocaleString()}
            </span>{" "}
            件
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-gray-300 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers().map((pg, i) =>
              typeof pg === "string" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="px-2 text-sm text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setCurrentPage(pg)}
                  className={`min-w-9 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    currentPage === pg
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pg}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded-md border border-gray-300 p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

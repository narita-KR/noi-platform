"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  UserX,
  UserCheck,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";

/* ============================================
   Types
   ============================================ */

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "無料会員" | "有料会員";
  registeredAt: string;
  lastLogin: string;
  status: "アクティブ" | "停止中";
}

type SortKey = "id" | "name" | "email" | "type" | "registeredAt" | "lastLogin" | "status";
type SortDir = "asc" | "desc";

/* ============================================
   Mock Data (50 users)
   ============================================ */

const LAST_NAMES = ["山田","田中","佐藤","鈴木","高橋","伊藤","渡辺","中村","小林","加藤","吉田","山本","松本","井上","木村","林","清水","斎藤","阿部","森"];
const FIRST_NAMES = ["太郎","花子","一郎","美咲","健太","由美","翔太","真理","大輝","裕子","隆","直子","拓也","恵","雄一","愛","慎一","陽子","修","明美"];

const MOCK_USERS: User[] = Array.from({ length: 50 }, (_, i) => {
  const ln = LAST_NAMES[i % LAST_NAMES.length];
  const fn = FIRST_NAMES[i % FIRST_NAMES.length];
  const day = String(((i * 3) % 28) + 1).padStart(2, "0");
  const month = String((i % 12) + 1).padStart(2, "0");
  const loginDay = String(29 - (i % 28)).padStart(2, "0");
  return {
    id: 1001 + i,
    name: `${ln} ${fn}`,
    email: `${ln.toLowerCase()}${fn.toLowerCase()}@example.com`,
    phone: `0${90 + (i % 3)}-${String(1000 + (i * 37) % 9000).padStart(4, "0")}-${String(1000 + (i * 53) % 9000).padStart(4, "0")}`,
    type: i % 4 === 0 ? "有料会員" : "無料会員",
    registeredAt: `2025-${month}-${day}`,
    lastLogin: `2026-01-${loginDay}`,
    status: i % 7 === 0 ? "停止中" : "アクティブ",
  };
});

const TOTAL_COUNT = 4521;
const NEW_THIS_MONTH = 34;
const PER_PAGE = 50;

/* ============================================
   Helpers
   ============================================ */

function typeBadge(type: User["type"]) {
  return type === "有料会員"
    ? "bg-amber-100 text-amber-700"
    : "bg-gray-100 text-gray-600";
}

function statusBadge(status: User["status"]) {
  return status === "アクティブ"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-600";
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("すべて");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  /* Local status overrides for toggle */
  const [statusOverrides, setStatusOverrides] = useState<Record<number, User["status"]>>({});

  const getUserStatus = (u: User) => statusOverrides[u.id] ?? u.status;

  /* --- Filter + Sort --- */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_USERS.filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      if (typeFilter !== "すべて" && u.type !== typeFilter) return false;
      const st = getUserStatus(u);
      if (statusFilter !== "すべて" && st !== statusFilter) return false;
      if (dateFrom && u.registeredAt < dateFrom) return false;
      if (dateTo && u.registeredAt > dateTo) return false;
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id - b.id; break;
        case "name": cmp = a.name.localeCompare(b.name); break;
        case "email": cmp = a.email.localeCompare(b.email); break;
        case "type": cmp = a.type.localeCompare(b.type); break;
        case "registeredAt": cmp = a.registeredAt.localeCompare(b.registeredAt); break;
        case "lastLogin": cmp = a.lastLogin.localeCompare(b.lastLogin); break;
        case "status": cmp = getUserStatus(a).localeCompare(getUserStatus(b)); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, typeFilter, statusFilter, dateFrom, dateTo, sortKey, sortDir, statusOverrides]);

  /* --- Sorting --- */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-gray-300" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 inline h-3.5 w-3.5 text-blue-500" />
      : <ArrowDown className="ml-1 inline h-3.5 w-3.5 text-blue-500" />;
  };

  /* --- Selection --- */
  const allSelected = filtered.length > 0 && filtered.every((u) => selectedIds.has(u.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((u) => u.id)));
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* --- Actions --- */
  const handleToggleStatus = (u: User) => {
    const current = getUserStatus(u);
    const next = current === "アクティブ" ? "停止中" : "アクティブ";
    if (confirm(`${u.name} のステータスを「${next}」に変更しますか？`)) {
      setStatusOverrides((prev) => ({ ...prev, [u.id]: next }));
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.size === 0) {
      if (selectedIds.size === 0) alert("会員を選択してください");
      return;
    }
    if (confirm(`選択した ${selectedIds.size} 件に「${bulkAction}」を実行しますか？`)) {
      console.log("Bulk:", bulkAction, [...selectedIds]);
      setSelectedIds(new Set());
      setBulkAction("");
    }
  };

  const handleExportCSV = () => {
    alert(`${TOTAL_COUNT.toLocaleString()} 件の会員データをCSVエクスポートします（モック）`);
  };

  /* --- Pagination --- */
  const totalPages = Math.ceil(TOTAL_COUNT / PER_PAGE);
  const startItem = (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, TOTAL_COUNT);

  const pageNumbers = () => {
    const pages: (number | string)[] = [];
    const cur = currentPage;
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (cur > 3) pages.push("...");
      for (let i = Math.max(2, cur - 1); i <= Math.min(totalPages - 1, cur + 1); i++) pages.push(i);
      if (cur < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const selectCls = "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="space-y-5">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会員管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            総会員数: <span className="font-semibold text-gray-700">{TOTAL_COUNT.toLocaleString()}人</span>
            <span className="mx-2 text-gray-300">|</span>
            今月の新規登録: <span className="font-semibold text-green-600">{NEW_THIS_MONTH}人</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <Download className="h-4 w-4" />
          CSVエクスポート
        </button>
      </div>

      {/* ===== 2. FILTER BAR ===== */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Search */}
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">検索</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="名前・メールアドレスで検索"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">会員種別</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            <option>無料会員</option>
            <option>有料会員</option>
          </select>
        </div>

        {/* Date range */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">登録日（開始）</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={selectCls}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">登録日（終了）</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={selectCls}
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">ステータス</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            <option>アクティブ</option>
            <option>停止中</option>
          </select>
        </div>
      </div>

      {/* ===== 3. TABLE CARD ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* ===== 4. BULK ACTIONS ===== */}
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
            <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className={selectCls}>
              <option value="">一括操作</option>
              <option value="メール一斉送信">メール一斉送信</option>
              <option value="アカウント停止">アカウント停止</option>
              <option value="削除">削除</option>
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
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("id")}>
                  ID <SortIcon col="id" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("name")}>
                  名前 <SortIcon col="name" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("email")}>
                  メールアドレス <SortIcon col="email" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  電話番号
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("type")}>
                  会員種別 <SortIcon col="type" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("registeredAt")}>
                  登録日 <SortIcon col="registeredAt" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("lastLogin")}>
                  最終ログイン <SortIcon col="lastLogin" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("status")}>
                  ステータス <SortIcon col="status" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const st = getUserStatus(u);
                return (
                  <tr
                    key={u.id}
                    className={`border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 ${
                      selectedIds.has(u.id) ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(u.id)}
                        onChange={() => toggleOne(u.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">
                      {u.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">
                      <Link
                        href={`/admin/members/${u.id}`}
                        className="text-blue-600 no-underline hover:underline"
                      >
                        {u.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {u.email}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {u.phone}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadge(u.type)}`}>
                        {u.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {u.registeredAt}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {u.lastLogin}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(st)}`}>
                        {st}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/members/${u.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 no-underline transition-colors hover:bg-blue-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          詳細
                        </Link>
                        <button
                          type="button"
                          onClick={() => alert(`${u.name} にメールを送信します（モック）`)}
                          className="inline-flex items-center rounded-md bg-gray-100 p-1.5 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
                          title="メール送信"
                        >
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(u)}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            st === "アクティブ"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {st === "アクティブ" ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              停止
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              再開
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-sm text-gray-400">
                    条件に一致する会員がいません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== 5. PAGINATION ===== */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{startItem}</span>–
            <span className="font-medium text-gray-700">{endItem}</span> /{" "}
            <span className="font-medium text-gray-700">{TOTAL_COUNT.toLocaleString()}</span> 人
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
                <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400">…</span>
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

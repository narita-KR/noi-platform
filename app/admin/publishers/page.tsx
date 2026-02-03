"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Eye,
  Building,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  List,
  Clock,
} from "lucide-react";

/* ============================================
   Types
   ============================================ */

interface Seller {
  id: number;
  company: string;
  license: string;
  contactName: string;
  phone: string;
  email: string;
  propertyCount: number;
  status: "承認済み" | "審査中" | "停止中";
  registeredAt: string;
}

type SortKey = "id" | "company" | "propertyCount" | "registeredAt";
type SortDir = "asc" | "desc";

/* ============================================
   Mock Data (30 sellers)
   ============================================ */

const COMPANY_NAMES = [
  "山田不動産","鈴木ホーム","伊藤リアルティ","加藤住宅","渡辺不動産",
  "高橋プロパティ","佐藤エステート","中村ハウス","小林建設","松本リビング",
  "井上地所","木村不動産","林アセット","清水住建","斎藤管理",
  "阿部地所","森不動産","山本住販","池田リアルティ","橋本ホーム",
  "石川不動産","前田エステート","藤田住宅","岡田プロパティ","後藤管理",
  "長谷川不動産","村上住建","近藤ハウス","坂本リビング","遠藤地所",
];

const STATUSES: Seller["status"][] = ["承認済み", "審査中", "停止中"];

const MOCK_SELLERS: Seller[] = Array.from({ length: 30 }, (_, i) => {
  const prefNum = (i % 47) + 1;
  const licNum = 10000 + i * 137;
  return {
    id: 2001 + i,
    company: COMPANY_NAMES[i % COMPANY_NAMES.length],
    license: `国土交通大臣(${Math.ceil((i + 1) / 10)})第${licNum}号`,
    contactName: `${COMPANY_NAMES[i % COMPANY_NAMES.length].slice(0, 2)} 太郎`,
    phone: `03-${String(1000 + (i * 41) % 9000).padStart(4, "0")}-${String(1000 + (i * 67) % 9000).padStart(4, "0")}`,
    email: `info@${COMPANY_NAMES[i % COMPANY_NAMES.length].toLowerCase().replace(/[^a-z]/g, "") || `company${i}`}.co.jp`,
    propertyCount: Math.floor(((i + 1) * 47) % 300) + 5,
    status: i < 24 ? "承認済み" : i < 27 ? "審査中" : "停止中",
    registeredAt: `2025-${String((i % 12) + 1).padStart(2, "0")}-${String(((i * 3) % 28) + 1).padStart(2, "0")}`,
  };
});

const TOTAL_COUNT = 127;
const NEW_THIS_MONTH = 3;
const PER_PAGE = 30;

/* ============================================
   Helpers
   ============================================ */

function statusBadge(status: Seller["status"]) {
  switch (status) {
    case "承認済み": return "bg-green-100 text-green-700";
    case "審査中": return "bg-yellow-100 text-yellow-700";
    case "停止中": return "bg-red-100 text-red-600";
  }
}

function statusIcon(status: Seller["status"]) {
  switch (status) {
    case "承認済み": return <CheckCircle className="h-3.5 w-3.5" />;
    case "審査中": return <Clock className="h-3.5 w-3.5" />;
    case "停止中": return <XCircle className="h-3.5 w-3.5" />;
  }
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminSellersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [sortKey, setSortKey] = useState<SortKey>("registeredAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, Seller["status"]>>({});

  const getStatus = (s: Seller) => statusOverrides[s.id] ?? s.status;

  /* --- Filter + Sort --- */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return MOCK_SELLERS.filter((s) => {
      if (q && !s.company.toLowerCase().includes(q) && !s.license.toLowerCase().includes(q)) return false;
      const st = getStatus(s);
      if (statusFilter !== "すべて" && st !== statusFilter) return false;
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id - b.id; break;
        case "company": cmp = a.company.localeCompare(b.company); break;
        case "propertyCount": cmp = a.propertyCount - b.propertyCount; break;
        case "registeredAt": cmp = a.registeredAt.localeCompare(b.registeredAt); break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, sortKey, sortDir, statusOverrides]);

  /* --- Sort toggle --- */
  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3.5 w-3.5 text-gray-300" />;
    return sortDir === "asc"
      ? <ArrowUp className="ml-1 inline h-3.5 w-3.5 text-blue-500" />
      : <ArrowDown className="ml-1 inline h-3.5 w-3.5 text-blue-500" />;
  };

  /* --- Status toggle --- */
  const handleToggleStatus = (s: Seller) => {
    const current = getStatus(s);
    let next: Seller["status"];
    if (current === "審査中") next = "承認済み";
    else if (current === "承認済み") next = "停止中";
    else next = "承認済み";

    const label = current === "審査中" ? "承認" : current === "承認済み" ? "停止" : "再開";
    if (confirm(`${s.company} を「${label}」しますか？`)) {
      setStatusOverrides((prev) => ({ ...prev, [s.id]: next }));
    }
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
          <h1 className="text-2xl font-bold text-gray-900">掲載者管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            登録業者数: <span className="font-semibold text-gray-700">{TOTAL_COUNT}社</span>
            <span className="mx-2 text-gray-300">|</span>
            今月の新規: <span className="font-semibold text-green-600">{NEW_THIS_MONTH}社</span>
          </p>
        </div>
        <Link
          href="/admin/publishers/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white no-underline shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          新規業者登録
        </Link>
      </div>

      {/* ===== 2. FILTER BAR ===== */}
      <div className="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="min-w-0 flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-500">検索</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="会社名・宅建番号で検索"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">ステータス</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            <option>承認済み</option>
            <option>審査中</option>
            <option>停止中</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">並び順</label>
          <select
            value={`${sortKey}-${sortDir}`}
            onChange={(e) => {
              const [k, d] = e.target.value.split("-") as [SortKey, SortDir];
              setSortKey(k);
              setSortDir(d);
            }}
            className={selectCls}
          >
            <option value="registeredAt-desc">登録日（新しい順）</option>
            <option value="registeredAt-asc">登録日（古い順）</option>
            <option value="company-asc">会社名（昇順）</option>
            <option value="company-desc">会社名（降順）</option>
            <option value="propertyCount-desc">掲載物件数（多い順）</option>
            <option value="propertyCount-asc">掲載物件数（少ない順）</option>
          </select>
        </div>
      </div>

      {/* ===== 3. TABLE ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("id")}>
                  ID <SortIcon col="id" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">ロゴ</th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("company")}>
                  会社名 <SortIcon col="company" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">宅建免許番号</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">担当者名</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">電話番号</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">メールアドレス</th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("propertyCount")}>
                  掲載物件数 <SortIcon col="propertyCount" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">ステータス</th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("registeredAt")}>
                  登録日 <SortIcon col="registeredAt" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const st = getStatus(s);
                return (
                  <tr key={s.id} className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">{s.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                        <Building className="h-5 w-5 text-gray-300" />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">{s.company}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-500">{s.license}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-700">{s.contactName}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{s.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{s.email}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center font-semibold text-gray-800">{s.propertyCount}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(st)}`}>
                        {statusIcon(st)}
                        {st}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">{s.registeredAt}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/publishers/${s.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 no-underline transition-colors hover:bg-blue-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          詳細
                        </Link>
                        <Link
                          href={`/admin/properties?seller=${s.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-medium text-gray-600 no-underline transition-colors hover:bg-gray-200"
                        >
                          <List className="h-3.5 w-3.5" />
                          物件一覧
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(s)}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            st === "承認済み"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : st === "審査中"
                                ? "bg-green-50 text-green-600 hover:bg-green-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {st === "承認済み" ? (
                            <><XCircle className="h-3.5 w-3.5" />停止</>
                          ) : st === "審査中" ? (
                            <><CheckCircle className="h-3.5 w-3.5" />承認</>
                          ) : (
                            <><CheckCircle className="h-3.5 w-3.5" />再開</>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-12 text-center text-sm text-gray-400">
                    条件に一致する業者がいません
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
            <span className="font-medium text-gray-700">{TOTAL_COUNT}</span> 社
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

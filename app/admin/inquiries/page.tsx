"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Send,
} from "lucide-react";

/* ============================================
   Types
   ============================================ */

interface Inquiry {
  id: number;
  receivedAt: string;
  propertyId: number;
  propertyName: string;
  userName: string;
  userEmail: string;
  type: "資料請求" | "内見希望" | "融資相談" | "その他";
  status: "未対応" | "対応中" | "完了";
  seller: string;
  isRead: boolean;
  hoursAgo: number;
}

type SortKey = "id" | "receivedAt" | "propertyName" | "userName" | "type" | "status";
type SortDir = "asc" | "desc";

/* ============================================
   Mock Data (50 inquiries)
   ============================================ */

const PROPERTY_NAMES = [
  "東京都港区 区分マンション","大阪府大阪市 一棟アパート","神奈川県横浜市 区分マンション",
  "東京都大田区 一棟マンション","福岡県福岡市 一棟アパート","愛知県名古屋市 区分マンション",
  "北海道札幌市 一棟アパート","京都府京都市 店舗・事務所","兵庫県神戸市 一棟ビル",
  "埼玉県さいたま市 土地",
];
const USER_NAMES = [
  "田中太郎","佐藤花子","山田一郎","鈴木美咲","高橋健太",
  "伊藤由美","渡辺翔太","中村真理","小林大輝","加藤裕子",
  "吉田隆","松本直子","井上拓也","木村恵","林雄一",
];
const SELLERS = ["山田不動産","鈴木ホーム","伊藤リアルティ","加藤住宅","渡辺不動産"];
const TYPES: Inquiry["type"][] = ["資料請求","内見希望","融資相談","その他"];
const STATUSES_LIST: Inquiry["status"][] = ["未対応","対応中","完了"];

const MOCK_INQUIRIES: Inquiry[] = Array.from({ length: 50 }, (_, i) => {
  const hrs = i < 5 ? i * 2 : i < 15 ? i * 4 : i * 12 + 24;
  const dt = new Date(Date.now() - hrs * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  const st: Inquiry["status"] = i < 12 ? "未対応" : i < 46 ? "対応中" : "完了";
  return {
    id: 5001 + i,
    receivedAt: dateStr,
    propertyId: 1001 + (i % 10),
    propertyName: PROPERTY_NAMES[i % PROPERTY_NAMES.length],
    userName: USER_NAMES[i % USER_NAMES.length],
    userEmail: `${USER_NAMES[i % USER_NAMES.length].toLowerCase().replace(/\s/g, "")}@example.com`,
    type: TYPES[i % TYPES.length],
    status: st,
    seller: SELLERS[i % SELLERS.length],
    isRead: st !== "未対応",
    hoursAgo: hrs,
  };
});

const STAT_UNREAD = MOCK_INQUIRIES.filter((q) => q.status === "未対応").length;
const STAT_PROGRESS = MOCK_INQUIRIES.filter((q) => q.status === "対応中").length;
const STAT_DONE = 1245;
const PER_PAGE = 20;

/* ============================================
   Helpers
   ============================================ */

function statusBadgeCls(status: Inquiry["status"]) {
  switch (status) {
    case "未対応": return "bg-red-100 text-red-700";
    case "対応中": return "bg-yellow-100 text-yellow-700";
    case "完了": return "bg-green-100 text-green-700";
  }
}

function statusIconEl(status: Inquiry["status"]) {
  switch (status) {
    case "未対応": return <AlertCircle className="h-3.5 w-3.5" />;
    case "対応中": return <Clock className="h-3.5 w-3.5" />;
    case "完了": return <CheckCircle className="h-3.5 w-3.5" />;
  }
}

function typeBadgeCls(type: Inquiry["type"]) {
  switch (type) {
    case "資料請求": return "bg-blue-100 text-blue-700";
    case "内見希望": return "bg-purple-100 text-purple-700";
    case "融資相談": return "bg-orange-100 text-orange-700";
    case "その他": return "bg-gray-100 text-gray-600";
  }
}

function rowPriority(inq: Inquiry, currentStatus: Inquiry["status"]) {
  if (currentStatus === "完了") return "";
  if (currentStatus === "未対応" && inq.hoursAgo >= 24) return "bg-red-50/60";
  if (currentStatus === "未対応") return "bg-yellow-50/60";
  return "";
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [typeFilter, setTypeFilter] = useState("すべて");
  const [periodFilter, setPeriodFilter] = useState("すべて");
  const [sortKey, setSortKey] = useState<SortKey>("receivedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, Inquiry["status"]>>({});

  const getStatus = (q: Inquiry) => statusOverrides[q.id] ?? q.status;

  /* --- Filter + Sort --- */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const now = Date.now();
    return MOCK_INQUIRIES.filter((inq) => {
      if (q && !inq.propertyName.toLowerCase().includes(q) && !inq.userName.toLowerCase().includes(q)) return false;
      const st = getStatus(inq);
      if (statusFilter !== "すべて" && st !== statusFilter) return false;
      if (typeFilter !== "すべて" && inq.type !== typeFilter) return false;
      if (periodFilter === "今日" && inq.hoursAgo > 24) return false;
      if (periodFilter === "今週" && inq.hoursAgo > 168) return false;
      if (periodFilter === "今月" && inq.hoursAgo > 720) return false;
      return true;
    }).sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "id": cmp = a.id - b.id; break;
        case "receivedAt": cmp = a.hoursAgo - b.hoursAgo; break;
        case "propertyName": cmp = a.propertyName.localeCompare(b.propertyName); break;
        case "userName": cmp = a.userName.localeCompare(b.userName); break;
        case "type": cmp = a.type.localeCompare(b.type); break;
        case "status": {
          const order = { "未対応": 0, "対応中": 1, "完了": 2 };
          cmp = order[getStatus(a)] - order[getStatus(b)];
          break;
        }
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, typeFilter, periodFilter, sortKey, sortDir, statusOverrides]);

  /* --- Sort --- */
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

  /* --- Selection --- */
  const allSelected = filtered.length > 0 && filtered.every((q) => selectedIds.has(q.id));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((q) => q.id)));
  };
  const toggleOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  /* --- Actions --- */
  const handleStatusChange = (id: number, newStatus: Inquiry["status"]) => {
    setStatusOverrides((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleDelete = (id: number) => {
    if (confirm(`問い合わせ ID:${id} を削除しますか？`)) {
      console.log("Delete inquiry:", id);
    }
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.size === 0) {
      if (selectedIds.size === 0) alert("問い合わせを選択してください");
      return;
    }
    if (confirm(`選択した ${selectedIds.size} 件に「${bulkAction}」を実行しますか？`)) {
      if (bulkAction === "対応中にする" || bulkAction === "完了にする") {
        const newSt = bulkAction === "対応中にする" ? "対応中" : "完了";
        setStatusOverrides((prev) => {
          const next = { ...prev };
          selectedIds.forEach((id) => { next[id] = newSt; });
          return next;
        });
      }
      console.log("Bulk:", bulkAction, [...selectedIds]);
      setSelectedIds(new Set());
      setBulkAction("");
    }
  };

  /* --- Pagination --- */
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
  const endItem = Math.min(currentPage * PER_PAGE, totalCount);

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">問い合わせ管理</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            <AlertCircle className="h-3.5 w-3.5" />
            未対応: {STAT_UNREAD}件
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            <Clock className="h-3.5 w-3.5" />
            対応中: {STAT_PROGRESS}件
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <CheckCircle className="h-3.5 w-3.5" />
            完了: {STAT_DONE.toLocaleString()}件
          </span>
        </div>
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
              placeholder="物件名・ユーザー名で検索"
              className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">ステータス</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            <option>未対応</option>
            <option>対応中</option>
            <option>完了</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">種類</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">期間</label>
          <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)} className={selectCls}>
            <option>すべて</option>
            <option>今日</option>
            <option>今週</option>
            <option>今月</option>
          </select>
        </div>
      </div>

      {/* ===== PRIORITY LEGEND ===== */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-red-200 bg-red-50" />
          未対応（24時間以上経過）
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-yellow-200 bg-yellow-50" />
          未対応
        </span>
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
            <span className="text-xs font-medium text-blue-600">{selectedIds.size}件選択中</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className={selectCls}>
              <option value="">一括操作</option>
              <option value="対応中にする">対応中にする</option>
              <option value="完了にする">完了にする</option>
              <option value="メール一斉送信">メール一斉送信</option>
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
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("receivedAt")}>
                  受信日時 <SortIcon col="receivedAt" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("propertyName")}>
                  物件名 <SortIcon col="propertyName" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("userName")}>
                  問い合わせ者 <SortIcon col="userName" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("type")}>
                  種類 <SortIcon col="type" />
                </th>
                <th className="cursor-pointer whitespace-nowrap px-4 py-3 font-semibold text-gray-500" onClick={() => handleSort("status")}>
                  ステータス <SortIcon col="status" />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">担当業者</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">アクション</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((inq) => {
                const st = getStatus(inq);
                const priority = rowPriority(inq, st);
                return (
                  <tr
                    key={inq.id}
                    className={`border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50 ${
                      selectedIds.has(inq.id) ? "bg-blue-50/50" : priority
                    }`}
                  >
                    <td className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(inq.id)}
                        onChange={() => toggleOne(inq.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {st === "未対応" && inq.hoursAgo >= 24 && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-mono text-xs text-gray-500">{inq.id}</span>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      <div>{inq.receivedAt}</div>
                      {inq.hoursAgo < 24 && (
                        <span className="text-xs text-gray-400">{inq.hoursAgo}時間前</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <Link
                        href={`/properties/${inq.propertyId}`}
                        className="font-medium text-blue-600 no-underline hover:underline"
                      >
                        {inq.propertyName}
                      </Link>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="font-medium text-gray-800">{inq.userName}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        {inq.userEmail}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadgeCls(inq.type)}`}>
                        {inq.type}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeCls(st)}`}>
                        {statusIconEl(st)}
                        {st}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">{inq.seller}</td>

                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/inquiries/${inq.id}`}
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 no-underline transition-colors hover:bg-blue-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          詳細
                        </Link>

                        <select
                          value={st}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as Inquiry["status"])}
                          className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-600 outline-none transition-colors hover:border-gray-300 focus:border-blue-400"
                        >
                          {STATUSES_LIST.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDelete(inq.id)}
                          className="inline-flex items-center rounded-md bg-red-50 p-1.5 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
                          title="削除"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-400">
                    条件に一致する問い合わせがありません
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
            <span className="font-medium text-gray-700">{totalCount}</span> 件
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

"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Building,
  Mail,
  Users,
  DollarSign,
  FileText,
  Eye,
  Heart,
  MessageSquare,
  LogIn,
  Clock,
  BarChart3,
} from "lucide-react";

/* ============================================
   Mock Data
   ============================================ */

const OVERVIEW_STATS = [
  { label: "総売上", value: "¥12,450,000", change: 12.5, icon: DollarSign, bg: "bg-green-50", iconBg: "bg-green-100", iconColor: "text-green-600" },
  { label: "新規物件登録数", value: "342", unit: "件", change: 8.3, icon: Building, bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { label: "問い合わせ件数", value: "1,291", unit: "件", change: -3.2, icon: Mail, bg: "bg-purple-50", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
  { label: "新規会員登録数", value: "189", unit: "人", change: 15.7, icon: Users, bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

const PROPERTY_TREND_30 = [
  { day: "12/31", v: 8 },{ day: "1/2", v: 5 },{ day: "1/4", v: 12 },{ day: "1/6", v: 9 },{ day: "1/8", v: 15 },
  { day: "1/10", v: 11 },{ day: "1/12", v: 18 },{ day: "1/14", v: 7 },{ day: "1/16", v: 14 },{ day: "1/18", v: 20 },
  { day: "1/20", v: 16 },{ day: "1/22", v: 13 },{ day: "1/24", v: 22 },{ day: "1/26", v: 10 },{ day: "1/29", v: 17 },
];

const INQUIRY_BY_TYPE = [
  { label: "資料請求", value: 45, color: "bg-blue-500" },
  { label: "内見希望", value: 28, color: "bg-purple-500" },
  { label: "融資相談", value: 15, color: "bg-orange-500" },
  { label: "その他", value: 12, color: "bg-gray-400" },
];

const MEMBER_TREND = [
  { month: "2025/11", v: 38 },{ month: "2025/12", v: 52 },{ month: "2026/01", v: 45 },
];

const AREA_RANKING = [
  { area: "東京都", count: 3842 },
  { area: "大阪府", count: 2156 },
  { area: "神奈川県", count: 1523 },
  { area: "愛知県", count: 987 },
  { area: "福岡県", count: 876 },
  { area: "北海道", count: 654 },
  { area: "埼玉県", count: 598 },
  { area: "千葉県", count: 543 },
  { area: "兵庫県", count: 487 },
  { area: "京都府", count: 412 },
];

const CATEGORY_DIST = [
  { label: "区分マンション", value: 4521, pct: 33.4, color: "bg-blue-500" },
  { label: "一棟アパート", value: 3245, pct: 24.0, color: "bg-green-500" },
  { label: "一棟マンション", value: 2187, pct: 16.2, color: "bg-purple-500" },
  { label: "一棟ビル", value: 1456, pct: 10.7, color: "bg-orange-500" },
  { label: "店舗・事務所", value: 1234, pct: 9.1, color: "bg-pink-500" },
  { label: "土地", value: 895, pct: 6.6, color: "bg-yellow-500" },
];

const TOP_PROPERTIES = [
  { rank: 1, name: "東京都港区 区分マンション", views: 2845, favs: 142, inquiries: 38 },
  { rank: 2, name: "大阪府大阪市 一棟アパート", views: 2103, favs: 98, inquiries: 31 },
  { rank: 3, name: "東京都大田区 一棟マンション", views: 1876, favs: 87, inquiries: 27 },
  { rank: 4, name: "神奈川県横浜市 区分マンション", views: 1654, favs: 76, inquiries: 24 },
  { rank: 5, name: "福岡県福岡市 一棟アパート", views: 1432, favs: 65, inquiries: 21 },
  { rank: 6, name: "愛知県名古屋市 区分マンション", views: 1298, favs: 58, inquiries: 19 },
  { rank: 7, name: "北海道札幌市 一棟アパート", views: 1187, favs: 52, inquiries: 17 },
  { rank: 8, name: "京都府京都市 店舗・事務所", views: 1054, favs: 41, inquiries: 14 },
  { rank: 9, name: "兵庫県神戸市 一棟ビル", views: 987, favs: 38, inquiries: 12 },
  { rank: 10, name: "埼玉県さいたま市 土地", views: 876, favs: 29, inquiries: 10 },
];

const TOP_USERS = [
  { rank: 1, name: "田中 太郎", logins: 87, inquiries: 12, lastAccess: "2026/01/29 15:30" },
  { rank: 2, name: "佐藤 花子", logins: 72, inquiries: 9, lastAccess: "2026/01/29 14:15" },
  { rank: 3, name: "山田 一郎", logins: 65, inquiries: 8, lastAccess: "2026/01/29 11:00" },
  { rank: 4, name: "鈴木 美咲", logins: 58, inquiries: 7, lastAccess: "2026/01/28 18:45" },
  { rank: 5, name: "高橋 健太", logins: 51, inquiries: 6, lastAccess: "2026/01/28 16:20" },
  { rank: 6, name: "伊藤 由美", logins: 45, inquiries: 5, lastAccess: "2026/01/28 10:00" },
  { rank: 7, name: "渡辺 翔太", logins: 42, inquiries: 5, lastAccess: "2026/01/27 14:30" },
  { rank: 8, name: "中村 真理", logins: 38, inquiries: 4, lastAccess: "2026/01/27 09:15" },
  { rank: 9, name: "小林 大輝", logins: 34, inquiries: 4, lastAccess: "2026/01/26 17:00" },
  { rank: 10, name: "加藤 裕子", logins: 31, inquiries: 3, lastAccess: "2026/01/26 11:45" },
];

const SELLER_PERFORMANCE = [
  { name: "山田不動産", properties: 156, inquiries: 342, replyRate: 94.2 },
  { name: "鈴木ホーム", properties: 123, inquiries: 287, replyRate: 91.5 },
  { name: "伊藤リアルティ", properties: 98, inquiries: 215, replyRate: 88.7 },
  { name: "加藤住宅", properties: 87, inquiries: 198, replyRate: 96.1 },
  { name: "渡辺不動産", properties: 76, inquiries: 167, replyRate: 85.3 },
  { name: "高橋プロパティ", properties: 65, inquiries: 142, replyRate: 92.8 },
  { name: "佐藤エステート", properties: 54, inquiries: 118, replyRate: 79.6 },
  { name: "中村ハウス", properties: 43, inquiries: 95, replyRate: 87.4 },
];

/* ============================================
   Mini chart components
   ============================================ */

function LineChart({ data }: { data: { day: string; v: number }[] }) {
  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const range = max - min || 1;
  const h = 140;
  const w = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg viewBox={`-6 -10 ${w + 12} ${h + 32}`} className="h-48 w-full">
      <polygon points={area} fill="rgba(59,130,246,0.08)" />
      <polyline points={pts} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d.v - min) / range) * h;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="2.5" fill="#3b82f6" />
            <text x={x} y={y - 7} textAnchor="middle" className="fill-gray-500" style={{ fontSize: 4.5 }}>{d.v}</text>
            {i % 3 === 0 && <text x={x} y={h + 12} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 4 }}>{d.day}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function BarChartGrouped({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-6 px-4 pt-4" style={{ height: 180 }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-xs font-semibold text-gray-700">{d.value}%</span>
          <div className={`w-full rounded-t ${d.color} transition-all`} style={{ height: `${(d.value / max) * 120}px` }} />
          <span className="mt-1 text-center text-[10px] leading-tight text-gray-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function AreaChart({ data }: { data: { month: string; v: number }[] }) {
  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const range = max - min || 1;
  const h = 100;
  const w = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ${pts} ${w},${h}`;

  return (
    <svg viewBox={`-6 -10 ${w + 12} ${h + 32}`} className="h-40 w-full">
      <polygon points={area} fill="rgba(34,197,94,0.15)" />
      <polyline points={pts} fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((d.v - min) / range) * h;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#22c55e" />
            <text x={x} y={y - 9} textAnchor="middle" className="fill-gray-600" style={{ fontSize: 6, fontWeight: 600 }}>{d.v}</text>
            <text x={x} y={h + 14} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 5 }}>{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminReportsPage() {
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-01-29");

  const handleExportPDF = () => alert("PDFレポートを生成します（モック）");
  const handleExportCSV = (name: string) => alert(`${name} をCSVエクスポートします（モック）`);

  return (
    <div className="space-y-6">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">レポート・分析</h1>
          <p className="mt-1 text-sm text-gray-500">サイト全体のパフォーマンスを分析します</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="border-none text-sm outline-none" />
            <span className="text-gray-400">〜</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="border-none text-sm outline-none" />
          </div>
          <button type="button" onClick={handleExportPDF} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700">
            <Download className="h-4 w-4" />
            PDFエクスポート
          </button>
        </div>
      </div>

      {/* ===== 2. OVERVIEW STATS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_STATS.map((s) => {
          const Icon = s.icon;
          const positive = s.change >= 0;
          return (
            <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {s.value}
                    {s.unit && <span className="ml-1 text-sm font-medium text-gray-400">{s.unit}</span>}
                  </p>
                </div>
                <div className={`rounded-lg p-2.5 ${s.iconBg}`}>
                  <Icon className={`h-5 w-5 ${s.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                {positive ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                <span className={`text-sm font-semibold ${positive ? "text-green-600" : "text-red-600"}`}>
                  {positive ? "+" : ""}{s.change}%
                </span>
                <span className="text-xs text-gray-400">前期比</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== 3. CHARTS ===== */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* A. Property registration trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              物件登録推移
            </h2>
            <span className="text-xs text-gray-400">直近30日間</span>
          </div>
          <LineChart data={PROPERTY_TREND_30} />
        </div>

        {/* B. Inquiry by type */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              問い合わせ種類別割合
            </h2>
            <span className="text-xs text-gray-400">今月</span>
          </div>
          <BarChartGrouped data={INQUIRY_BY_TYPE} />
        </div>

        {/* C. Member registration trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Users className="h-4 w-4 text-green-500" />
              会員登録推移
            </h2>
            <span className="text-xs text-gray-400">直近3ヶ月</span>
          </div>
          <AreaChart data={MEMBER_TREND} />
        </div>

        {/* D. Area ranking */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <Building className="h-4 w-4 text-orange-500" />
              人気エリアランキング
            </h2>
            <span className="text-xs text-gray-400">Top 10</span>
          </div>
          <div className="space-y-2.5">
            {AREA_RANKING.map((a, i) => {
              const maxCount = AREA_RANKING[0].count;
              return (
                <div key={a.area} className="flex items-center gap-3">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i < 3 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </span>
                  <span className="w-20 shrink-0 text-sm font-medium text-gray-700">{a.area}</span>
                  <div className="flex-1">
                    <div className="h-5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-orange-400 transition-all"
                        style={{ width: `${(a.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-semibold text-gray-600">{a.count.toLocaleString()}件</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* E. Category distribution */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <BarChart3 className="h-4 w-4 text-pink-500" />
            カテゴリー別物件数
          </h2>
          <span className="text-xs text-gray-400">全 {CATEGORY_DIST.reduce((s, c) => s + c.value, 0).toLocaleString()} 件</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_DIST.map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
              <div className={`h-10 w-1.5 shrink-0 rounded-full ${c.color}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{c.label}</p>
                <p className="text-xs text-gray-400">{c.value.toLocaleString()}件</p>
              </div>
              <span className="text-lg font-bold text-gray-800">{c.pct}%</span>
            </div>
          ))}
        </div>
        {/* Stacked bar */}
        <div className="mt-4 flex h-6 overflow-hidden rounded-full">
          {CATEGORY_DIST.map((c) => (
            <div key={c.label} className={`${c.color} transition-all`} style={{ width: `${c.pct}%` }} title={`${c.label}: ${c.pct}%`} />
          ))}
        </div>
      </div>

      {/* ===== 4. DETAILED TABLES ===== */}

      {/* TABLE 1: Popular properties */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Eye className="h-4 w-4 text-blue-500" />
            人気物件 Top 10
          </h2>
          <button type="button" onClick={() => handleExportCSV("人気物件")} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600">
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">順位</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">物件名</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />閲覧数</span>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />お気に入り</span>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />問い合わせ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TOP_PROPERTIES.map((p) => (
                <tr key={p.rank} className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      p.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-700">{p.views.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">{p.favs}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">{p.inquiries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 2: Active users */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Users className="h-4 w-4 text-green-500" />
            アクティブユーザー Top 10
          </h2>
          <button type="button" onClick={() => handleExportCSV("アクティブユーザー")} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600">
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">順位</th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-gray-500">名前</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><LogIn className="h-3.5 w-3.5" />ログイン回数</span>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />問い合わせ</span>
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />最終アクセス</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {TOP_USERS.map((u) => (
                <tr key={u.rank} className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      u.rank <= 3 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {u.rank}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">{u.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-700">{u.logins}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-600">{u.inquiries}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-500">{u.lastAccess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TABLE 3: Seller performance */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Building className="h-4 w-4 text-purple-500" />
            業者別実績
          </h2>
          <button type="button" onClick={() => handleExportCSV("業者別実績")} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-blue-600">
            <Download className="h-3.5 w-3.5" />
            CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">業者名</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">掲載物件数</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">問い合わせ数</th>
                <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-500">返信率</th>
              </tr>
            </thead>
            <tbody>
              {SELLER_PERFORMANCE.map((s) => (
                <tr key={s.name} className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-800">{s.name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">{s.properties}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-gray-700">{s.inquiries}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <span className={`font-semibold ${s.replyRate >= 90 ? "text-green-600" : s.replyRate >= 80 ? "text-yellow-600" : "text-red-600"}`}>
                      {s.replyRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 5. EXPORT OPTIONS ===== */}
      <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <span className="mr-auto text-sm font-medium text-gray-500">
          <FileText className="mr-1.5 inline h-4 w-4" />
          データエクスポート
        </span>
        <button type="button" onClick={() => handleExportCSV("全データ")} className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          CSVエクスポート（全テーブル）
        </button>
        <button type="button" onClick={handleExportPDF} className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700">
          <Download className="h-4 w-4" />
          PDFレポート生成
        </button>
      </div>
    </div>
  );
}

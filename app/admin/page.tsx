"use client";

import Link from "next/link";
import {
  Building,
  Mail,
  Users,
  Store,
  Plus,
  MessageSquare,
  UserCog,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

/* ============================================
   Mock Data
   ============================================ */

const STATS = [
  {
    label: "総物件数",
    value: "13,538",
    unit: "件",
    change: "+125",
    period: "今月",
    icon: Building,
    color: "blue",
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    changeColor: "text-blue-600",
  },
  {
    label: "新着問い合わせ",
    value: "89",
    unit: "件",
    change: "+12",
    period: "今日",
    icon: Mail,
    color: "green",
    bg: "bg-green-50",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    changeColor: "text-green-600",
  },
  {
    label: "会員数",
    value: "4,521",
    unit: "人",
    change: "+34",
    period: "今週",
    icon: Users,
    color: "purple",
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    changeColor: "text-purple-600",
  },
  {
    label: "掲載業者数",
    value: "127",
    unit: "社",
    change: "+3",
    period: "今月",
    icon: Store,
    color: "orange",
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    changeColor: "text-orange-600",
  },
];

const QUICK_ACTIONS = [
  { label: "物件を登録", href: "/admin/properties/new", icon: Plus, color: "bg-blue-600 hover:bg-blue-700" },
  { label: "問い合わせを確認", href: "/admin/inquiries", icon: MessageSquare, color: "bg-green-600 hover:bg-green-700" },
  { label: "会員を管理", href: "/admin/members", icon: UserCog, color: "bg-purple-600 hover:bg-purple-700" },
  { label: "レポートを表示", href: "/admin/reports", icon: BarChart3, color: "bg-orange-600 hover:bg-orange-700" },
];

const RECENT_ACTIVITIES = [
  { time: "15:23", action: "新規物件登録", user: "山田不動産", detail: "東京都港区 区分マンション", type: "property" },
  { time: "14:55", action: "問い合わせ受信", user: "田中太郎", detail: "物件ID: 1234", type: "inquiry" },
  { time: "14:32", action: "会員登録", user: "佐藤花子", detail: "無料会員", type: "member" },
  { time: "13:48", action: "物件更新", user: "鈴木ホーム", detail: "大阪府大阪市 一棟マンション", type: "property" },
  { time: "13:15", action: "問い合わせ受信", user: "高橋一郎", detail: "物件ID: 5678", type: "inquiry" },
  { time: "12:50", action: "掲載者登録", user: "渡辺不動産", detail: "法人会員", type: "publisher" },
  { time: "12:22", action: "物件削除", user: "伊藤リアルティ", detail: "神奈川県横浜市 区分マンション", type: "property" },
  { time: "11:45", action: "問い合わせ受信", user: "中村美咲", detail: "物件ID: 9012", type: "inquiry" },
  { time: "11:10", action: "会員登録", user: "小林健太", detail: "無料会員", type: "member" },
  { time: "10:30", action: "物件登録", user: "加藤住宅", detail: "福岡県福岡市 一棟アパート", type: "property" },
];

const CHART_PROPERTY_DATA = [
  { day: "1/23", value: 42 },
  { day: "1/24", value: 38 },
  { day: "1/25", value: 55 },
  { day: "1/26", value: 31 },
  { day: "1/27", value: 48 },
  { day: "1/28", value: 62 },
  { day: "1/29", value: 45 },
];

const CHART_INQUIRY_DATA = [
  { day: "1/23", value: 12 },
  { day: "1/24", value: 18 },
  { day: "1/25", value: 15 },
  { day: "1/26", value: 9 },
  { day: "1/27", value: 22 },
  { day: "1/28", value: 25 },
  { day: "1/29", value: 19 },
];

/* ============================================
   Helper: action type badge
   ============================================ */

function actionBadge(type: string) {
  switch (type) {
    case "property":
      return "bg-blue-100 text-blue-700";
    case "inquiry":
      return "bg-green-100 text-green-700";
    case "member":
      return "bg-purple-100 text-purple-700";
    case "publisher":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

/* ============================================
   Simple Bar Chart
   ============================================ */

function BarChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-3 pt-4" style={{ height: 160 }}>
      {data.map((d) => (
        <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-medium text-gray-500">
            {d.value}
          </span>
          <div
            className="w-full rounded-t-sm bg-blue-500 transition-all"
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <span className="text-[10px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================================
   Simple Line Chart
   ============================================ */

function LineChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min || 1;
  const h = 130;
  const w = 100;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d.value - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div className="pt-4">
      <svg viewBox={`-4 -8 ${w + 8} ${h + 30}`} className="w-full" style={{ height: 160 }}>
        {/* Area fill */}
        <polygon points={areaPoints} fill="rgba(34,197,94,0.1)" />
        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Dots + labels */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w;
          const y = h - ((d.value - min) / range) * h;
          return (
            <g key={d.day}>
              <circle cx={x} cy={y} r="3" fill="#22c55e" />
              <text
                x={x}
                y={y - 8}
                textAnchor="middle"
                className="fill-gray-500"
                style={{ fontSize: 5 }}
              >
                {d.value}
              </text>
              <text
                x={x}
                y={h + 14}
                textAnchor="middle"
                className="fill-gray-400"
                style={{ fontSize: 5 }}
              >
                {d.day}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ============================================
   Page Component
   ============================================ */

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-sm text-gray-500">2026年1月29日</p>
      </div>

      {/* ===== 2. STATS CARDS ===== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                    <span className="ml-1 text-base font-medium text-gray-400">
                      {stat.unit}
                    </span>
                  </p>
                </div>
                <div className={`rounded-lg p-2.5 ${stat.iconBg}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1">
                <ArrowUpRight className={`h-4 w-4 ${stat.changeColor}`} />
                <span className={`text-sm font-semibold ${stat.changeColor}`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-400">({stat.period})</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== 3. QUICK ACTIONS ===== */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-bold text-white no-underline shadow-sm transition-all hover:shadow-md ${action.color}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {action.label}
            </Link>
          );
        })}
      </div>

      {/* ===== 4. RECENT ACTIVITY TABLE ===== */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-gray-900">
            最近のアクティビティ
          </h2>
          <span className="text-xs text-gray-400">直近10件</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">
                  時刻
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">
                  アクション
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">
                  ユーザー
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-semibold text-gray-500">
                  詳細
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITIES.map((activity, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-500">
                    {activity.time}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${actionBadge(activity.type)}`}
                    >
                      {activity.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-700">
                    {activity.user}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                    {activity.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== 5. CHARTS ===== */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Bar chart: property registrations */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h2 className="text-sm font-bold text-gray-900">物件登録推移</h2>
            <span className="ml-auto text-xs text-gray-400">直近7日間</span>
          </div>
          <BarChart data={CHART_PROPERTY_DATA} />
        </div>

        {/* Line chart: inquiries */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <h2 className="text-sm font-bold text-gray-900">問い合わせ推移</h2>
            <span className="ml-auto text-xs text-gray-400">直近7日間</span>
          </div>
          <LineChart data={CHART_INQUIRY_DATA} />
        </div>
      </div>
    </div>
  );
}

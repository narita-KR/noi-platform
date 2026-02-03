"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Calendar,
  Heart,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  MapPin,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock helpers                                                       */
/* ------------------------------------------------------------------ */

const names = [
  "田中 太郎",
  "佐藤 花子",
  "鈴木 一郎",
  "高橋 美咲",
  "伊藤 健太",
  "渡辺 由美",
  "山本 大輔",
  "中村 恵子",
  "小林 翔太",
  "加藤 裕子",
  "吉田 勇気",
  "山田 直子",
  "松本 海斗",
  "井上 真理",
  "木村 蓮",
  "林 さくら",
  "斎藤 拓也",
  "清水 綾香",
  "山崎 悠人",
  "森 京子",
];

const kanaNames = [
  "タナカ タロウ",
  "サトウ ハナコ",
  "スズキ イチロウ",
  "タカハシ ミサキ",
  "イトウ ケンタ",
  "ワタナベ ユミ",
  "ヤマモト ダイスケ",
  "ナカムラ ケイコ",
  "コバヤシ ショウタ",
  "カトウ ユウコ",
  "ヨシダ ユウキ",
  "ヤマダ ナオコ",
  "マツモト カイト",
  "イノウエ マリ",
  "キムラ レン",
  "ハヤシ サクラ",
  "サイトウ タクヤ",
  "シミズ アヤカ",
  "ヤマザキ ユウト",
  "モリ キョウコ",
];

const addresses = [
  "東京都港区六本木1-2-3",
  "東京都渋谷区神宮前4-5-6",
  "大阪府大阪市北区梅田7-8-9",
  "神奈川県横浜市中区山下町10-11",
  "東京都新宿区西新宿12-13-14",
  "福岡県福岡市中央区天神15-16",
  "愛知県名古屋市中区栄17-18",
  "東京都世田谷区三軒茶屋19-20",
  "北海道札幌市中央区大通21-22",
  "京都府京都市中京区河原町23-24",
];

const postalCodes = [
  "〒106-0032",
  "〒150-0001",
  "〒530-0001",
  "〒231-0023",
  "〒160-0023",
  "〒810-0001",
  "〒460-0008",
  "〒154-0024",
  "〒060-0042",
  "〒604-8005",
];

const categories = [
  ["区分マンション", "一棟アパート"],
  ["一棟マンション", "区分マンション"],
  ["一棟アパート", "一棟マンション", "事務所"],
  ["区分マンション"],
  ["一棟マンション", "一棟アパート", "店舗"],
  ["区分マンション", "一棟アパート"],
  ["一棟マンション"],
  ["区分マンション", "事務所", "店舗"],
  ["一棟アパート", "区分マンション"],
  ["一棟マンション", "一棟アパート"],
];

const favoriteProperties = [
  { name: "東京都大田区 区分マンション", price: "5億8,000万円", id: 1001 },
  { name: "品川区 一棟アパート", price: "2億円", id: 1002 },
  { name: "横浜市中区 一棟マンション", price: "3億5,000万円", id: 1003 },
  { name: "世田谷区 区分マンション", price: "8,500万円", id: 1004 },
  { name: "新宿区 店舗付き住宅", price: "1億2,000万円", id: 1005 },
  { name: "渋谷区 一棟アパート", price: "4億3,000万円", id: 1006 },
  { name: "名古屋市中区 一棟マンション", price: "6億円", id: 1007 },
  { name: "大阪市北区 区分マンション", price: "9,800万円", id: 1008 },
];

const activityLog = [
  {
    date: "2026/01/29 15:30",
    action: "物件詳細閲覧",
    detail: "物件ID: 1234",
    icon: "view",
  },
  {
    date: "2026/01/28 10:15",
    action: "問い合わせ送信",
    detail: "東京都大田区 区分マンション",
    icon: "inquiry",
  },
  {
    date: "2026/01/27 14:20",
    action: "お気に入り追加",
    detail: "品川区 一棟アパート",
    icon: "favorite",
  },
  {
    date: "2026/01/26 09:00",
    action: "ログイン",
    detail: "IP: 203.0.113.45",
    icon: "login",
  },
  {
    date: "2026/01/25 16:45",
    action: "物件詳細閲覧",
    detail: "物件ID: 1098",
    icon: "view",
  },
  {
    date: "2026/01/24 11:30",
    action: "お気に入り削除",
    detail: "新宿区 一棟マンション",
    icon: "favorite",
  },
  {
    date: "2026/01/23 13:10",
    action: "検索実行",
    detail: "東京都 / 一棟アパート / 1億〜3億円",
    icon: "search",
  },
  {
    date: "2026/01/22 08:50",
    action: "ログイン",
    detail: "IP: 203.0.113.45",
    icon: "login",
  },
  {
    date: "2026/01/20 17:20",
    action: "プロフィール更新",
    detail: "電話番号変更",
    icon: "edit",
  },
  {
    date: "2026/01/18 14:00",
    action: "問い合わせ送信",
    detail: "横浜市中区 一棟マンション",
    icon: "inquiry",
  },
];

const inquiryHistory = [
  {
    id: 3001,
    date: "2026/01/28",
    property: "東京都大田区 区分マンション",
    status: "対応中",
  },
  {
    id: 3002,
    date: "2026/01/18",
    property: "横浜市中区 一棟マンション",
    status: "完了",
  },
  {
    id: 3003,
    date: "2026/01/05",
    property: "品川区 一棟アパート",
    status: "完了",
  },
  {
    id: 3004,
    date: "2025/12/22",
    property: "世田谷区 区分マンション",
    status: "完了",
  },
  {
    id: 3005,
    date: "2025/12/10",
    property: "新宿区 店舗付き住宅",
    status: "未対応",
  },
];

function buildUser(id: string) {
  const n = Math.abs(parseInt(id, 10) || 1);
  const idx = (n - 1) % names.length;
  const addrIdx = (n - 1) % addresses.length;
  const genders = ["男性", "女性"];
  const types = ["一般会員", "プレミアム会員", "法人会員"];
  const incomes = [
    "400万円",
    "600万円",
    "800万円",
    "1,000万円",
    "1,200万円",
    "1,500万円",
    "2,000万円",
  ];
  const funds = [
    "500万円",
    "1,000万円",
    "1,500万円",
    "2,000万円",
    "3,000万円",
    "5,000万円",
  ];

  return {
    id,
    name: names[idx],
    kana: kanaNames[idx],
    email: `user${id}@example.com`,
    phone: `090-${String(1234 + n).padStart(4, "0")}-${String(5678 + n).padStart(4, "0")}`,
    gender: genders[n % 2],
    birthday: `${1975 + (n % 20)}/${String((n % 12) + 1).padStart(2, "0")}/${String((n % 28) + 1).padStart(2, "0")}`,
    age: 2026 - (1975 + (n % 20)),
    postalCode: postalCodes[addrIdx],
    address: addresses[addrIdx],
    type: types[n % 3],
    status: n % 7 === 0 ? "停止中" : "有効",
    registeredAt: "2025/12/15",
    lastLogin: "2026/01/29 14:30",
    income: incomes[n % incomes.length],
    funds: funds[n % funds.length],
    categories: categories[idx % categories.length],
    mailDelivery: n % 4 !== 0,
    favoriteCount: 8,
    inquiryCount: 5,
    viewCount: 142,
    loginCount: 23,
  };
}

/* ------------------------------------------------------------------ */
/*  Activity icon helper                                               */
/* ------------------------------------------------------------------ */

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "view":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <Eye className="h-4 w-4 text-blue-600" />
        </div>
      );
    case "inquiry":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
          <MessageSquare className="h-4 w-4 text-green-600" />
        </div>
      );
    case "favorite":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100">
          <Heart className="h-4 w-4 text-pink-600" />
        </div>
      );
    case "login":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
          <User className="h-4 w-4 text-purple-600" />
        </div>
      );
    case "edit":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
          <Edit className="h-4 w-4 text-orange-600" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
          <Eye className="h-4 w-4 text-gray-600" />
        </div>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

type TabKey = "info" | "activity" | "favorites" | "inquiries" | "notes";

export default function AdminUserDetailPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();

  const user = buildUser(userId);

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [adminNote, setAdminNote] = useState(
    "初回面談済み。投資意欲が高く、区分マンションを中心に検討中。自己資金は十分あり、融資相談も希望している。次回フォロー予定：2026年2月中旬。"
  );
  const [noteSaved, setNoteSaved] = useState(false);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "info", label: "基本情報" },
    { key: "activity", label: "アクティビティ履歴" },
    { key: "favorites", label: "お気に入り物件" },
    { key: "inquiries", label: "問い合わせ履歴" },
    { key: "notes", label: "管理者メモ" },
  ];

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  /* ---- Stats cards data ---- */
  const stats = [
    {
      label: "お気に入り",
      value: `${user.favoriteCount}件`,
      icon: Heart,
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
    {
      label: "問い合わせ",
      value: `${user.inquiryCount}件`,
      icon: MessageSquare,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "閲覧履歴",
      value: `${user.viewCount}件`,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "ログイン回数",
      value: `${user.loginCount}回`,
      icon: User,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  /* ---- Info table rows ---- */
  const infoRows = [
    { label: "氏名", value: user.name },
    { label: "フリガナ", value: user.kana },
    {
      label: "生年月日",
      value: `${user.birthday}（${user.age}歳）`,
    },
    { label: "性別", value: user.gender },
    { label: "メールアドレス", value: user.email },
    { label: "電話番号", value: user.phone },
    { label: "郵便番号", value: user.postalCode },
    { label: "住所", value: user.address },
    { label: "年収", value: user.income },
    { label: "自己資金", value: user.funds },
    {
      label: "興味のあるカテゴリー",
      value: user.categories.join(", "),
    },
    {
      label: "メール配信",
      value: user.mailDelivery ? "配信する" : "配信しない",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ---- Breadcrumb ---- */}
      <nav className="text-sm text-gray-500">
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href="/admin"
              className="text-gray-500 no-underline hover:text-gray-700"
            >
              ダッシュボード
            </Link>
          </li>
          <li className="text-gray-400">&gt;</li>
          <li>
            <Link
              href="/admin/members"
              className="text-gray-500 no-underline hover:text-gray-700"
            >
              会員管理
            </Link>
          </li>
          <li className="text-gray-400">&gt;</li>
          <li className="text-gray-700">{user.name}</li>
        </ol>
      </nav>

      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/members")}
            className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            会員一覧に戻る
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Mail className="h-4 w-4" />
            メール送信
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Edit className="h-4 w-4" />
            編集
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100">
            <User className="h-4 w-4" />
            アカウント停止
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100">
            <Trash2 className="h-4 w-4" />
            削除
          </button>
        </div>
      </div>

      {/* ---- User info card ---- */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Avatar */}
          <div className="shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-500">
              {user.name.charAt(0)}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.type === "プレミアム会員"
                    ? "bg-amber-100 text-amber-800"
                    : user.type === "法人会員"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.type}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.status === "有効"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {user.phone}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {user.address}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                登録日: {user.registeredAt}
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                最終ログイン: {user.lastLogin}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Stats cards ---- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-sm"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}
            >
              <s.icon className={`h-6 w-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Tabs ---- */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* Tab header */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* ---- Tab 1: 基本情報 ---- */}
          {activeTab === "info" && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <tbody>
                  {infoRows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <th className="w-48 whitespace-nowrap px-6 py-3 text-left font-medium text-gray-500">
                        {row.label}
                      </th>
                      <td className="px-6 py-3 text-gray-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- Tab 2: アクティビティ履歴 ---- */}
          {activeTab === "activity" && (
            <div className="space-y-0">
              {activityLog.map((item, i) => (
                <div key={i} className="flex gap-4 py-4">
                  <div className="flex flex-col items-center">
                    <ActivityIcon type={item.icon} />
                    {i < activityLog.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-gray-200" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-medium text-gray-900">
                        {item.action}
                      </span>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ---- Tab 3: お気に入り物件 ---- */}
          {activeTab === "favorites" && (
            <div>
              <p className="mb-4 text-sm text-gray-500">
                お気に入り登録:{" "}
                <span className="font-semibold text-gray-900">
                  {favoriteProperties.length}件
                </span>
              </p>
              <div className="space-y-2">
                {favoriteProperties.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-pink-500" />
                      <Link
                        href={`/admin/properties/${p.id}`}
                        className="text-sm font-medium text-blue-600 no-underline hover:underline"
                      >
                        {p.name}
                      </Link>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {p.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---- Tab 4: 問い合わせ履歴 ---- */}
          {activeTab === "inquiries" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-4 py-3 font-medium text-gray-500">
                      日時
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      物件名
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      ステータス
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-500">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inquiryHistory.map((inq) => (
                    <tr
                      key={inq.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                        {inq.date}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {inq.property}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            inq.status === "対応中"
                              ? "bg-yellow-100 text-yellow-800"
                              : inq.status === "完了"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/inquiries/${inq.id}`}
                          className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 no-underline hover:bg-gray-200"
                        >
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ---- Tab 5: 管理者メモ ---- */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                placeholder="管理者用のメモを入力..."
              />
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveNote}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  保存
                </button>
                {noteSaved && (
                  <span className="text-sm text-green-600">
                    メモを保存しました
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

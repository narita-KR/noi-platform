"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  TrainFront,
  Calendar,
  Heart,
  FileText,
  Mail,
  Building,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import type { PropertyCardProps } from "@/components/PropertyCard";

/* ============================================
   Dummy Data
   ============================================ */

const IMAGES = [
  "/images/property-1.jpg",
  "/images/property-2.jpg",
  "/images/property-3.jpg",
  "/images/property-4.jpg",
  "/images/property-5.jpg",
  "/images/property-6.jpg",
  "/images/property-7.jpg",
  "/images/property-8.jpg",
];

const EXPENSE_DATA = [
  { label: "固定資産税・都市計画税", amount: "480,000" },
  { label: "管理費", amount: "360,000" },
  { label: "修繕積立金", amount: "240,000" },
  { label: "保険料", amount: "120,000" },
  { label: "清掃費", amount: "96,000" },
  { label: "水道光熱費（共用部）", amount: "84,000" },
  { label: "その他経費", amount: "60,000" },
];

const BASIC_INFO: [string, string][] = [
  ["物件名", "東京都大田区 区分マンション"],
  ["所在地", "東京都大田区上池台4"],
  ["交通", "東急池上線 長原駅 徒歩1分"],
  ["価格", "5億8,000万円"],
  ["土地権利", "所有権"],
  ["地目", "宅地"],
  ["都市計画", "市街化区域"],
  ["用途地域", "第一種中高層住居専用地域"],
  ["建ぺい率", "60%"],
  ["容積率", "200%"],
  ["土地面積", "250.32㎡（公簿）"],
  ["私道負担", "なし"],
  ["建物面積", "180.45㎡"],
  ["間取り", "1K × 12戸"],
  ["構造", "RC造"],
  ["階建", "地上5階建"],
  ["築年月", "2000年10月"],
  ["接道状況", "南東側 公道 約6m"],
  ["設備", "オートロック、宅配ボックス、CATV、インターネット対応"],
  ["駐車場", "なし"],
  ["引渡時期", "相談"],
  ["現況", "賃貸中（満室）"],
  ["取引態様", "仲介"],
  ["備考", "現況有姿引渡。レントロール有り。"],
];

const RELATED_PROPERTIES: PropertyCardProps[] = [
  {
    id: 11,
    title: "東京都大田区 一棟アパート",
    category: "一棟アパート",
    price: 9800,
    yield: 7.5,
    location: "東京都大田区蒲田5",
    station: "JR京浜東北線 蒲田駅",
    walkTime: "徒歩5分",
    builtYear: "2005年3月",
    age: 20,
    structure: "鉄骨造",
    image: "",
    registeredDate: "11/25",
    isNew: true,
  },
  {
    id: 12,
    title: "東京都大田区 区分マンション",
    category: "区分マンション",
    price: 3500,
    yield: 6.8,
    location: "東京都大田区大森北3",
    station: "JR京浜東北線 大森駅",
    walkTime: "徒歩7分",
    builtYear: "1998年8月",
    age: 27,
    structure: "RC造",
    image: "",
    registeredDate: "11/24",
    isNew: true,
  },
  {
    id: 13,
    title: "東京都大田区 一棟マンション",
    category: "一棟マンション",
    price: 28000,
    yield: 5.9,
    location: "東京都大田区田園調布2",
    station: "東急東横線 田園調布駅",
    walkTime: "徒歩3分",
    builtYear: "2012年6月",
    age: 13,
    structure: "RC造",
    image: "",
    registeredDate: "11/23",
    isNew: false,
  },
  {
    id: 14,
    title: "東京都大田区 戸建",
    category: "戸建",
    price: 6200,
    yield: 9.3,
    location: "東京都大田区久が原1",
    station: "東急池上線 久が原駅",
    walkTime: "徒歩4分",
    builtYear: "1990年2月",
    age: 35,
    structure: "木造",
    image: "",
    registeredDate: "11/22",
    isNew: false,
  },
];

const TABS = [
  "オンサイト経費内訳明細",
  "基本情報",
  "地図",
  "収支シミュレーション",
  "類似物件",
];

/* ============================================
   Page Component
   ============================================ */

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  /* Simulation state */
  const [equity, setEquity] = useState(10000);
  const [loan, setLoan] = useState(48000);
  const [rate, setRate] = useState(1.5);
  const [years, setYears] = useState(30);

  const monthlyPayment = (() => {
    const monthlyRate = rate / 100 / 12;
    const n = years * 12;
    if (monthlyRate === 0) return loan / n;
    return (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
  })();

  const annualIncome = 600;
  const annualExpense = EXPENSE_DATA.reduce(
    (sum, e) => sum + Number(e.amount.replace(/,/g, "")),
    0
  ) / 10000;
  const annualLoanPayment = (monthlyPayment * 12);
  const cashFlow = annualIncome - annualExpense - annualLoanPayment;

  const prevImage = () =>
    setSelectedImage((prev) => (prev === 0 ? IMAGES.length - 1 : prev - 1));
  const nextImage = () =>
    setSelectedImage((prev) => (prev === IMAGES.length - 1 ? 0 : prev + 1));

  return (
    <div className="mx-auto max-w-350 px-4 py-6">
      {/* ===== BREADCRUMB ===== */}
      <nav className="mb-6 text-sm text-muted" aria-label="パンくずリスト">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-primary">
              TOP
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link href="/search?sort=new" className="hover:text-primary">
              新着
            </Link>
          </li>
          <li>
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li className="font-medium text-foreground">
            東京都大田区 区分マンション
          </li>
        </ol>
      </nav>

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* ===== LEFT COLUMN (60%) ===== */}
        <div className="min-w-0 space-y-6 lg:w-3/5">
          {/* A. IMAGE GALLERY */}
          <div>
            {/* Main Image */}
            <div className="relative h-64 overflow-hidden rounded-lg bg-gray-200 sm:h-80 md:h-100">
              {IMAGES[selectedImage] ? (
                <div className="flex h-full items-center justify-center text-lg font-medium text-gray-400">
                  物件画像 {selectedImage + 1}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-lg font-medium text-gray-400">
                  物件画像
                </div>
              )}

              {/* Navigation arrows */}
              <button
                type="button"
                onClick={prevImage}
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                aria-label="前の画像"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextImage}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                aria-label="次の画像"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image counter */}
              <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                {selectedImage + 1} / {IMAGES.length}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="mt-3 grid grid-cols-4 gap-2">
              {IMAGES.slice(0, 4).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 overflow-hidden rounded-md bg-gray-200 transition-all sm:h-20 ${
                    selectedImage === i
                      ? "ring-2 ring-primary ring-offset-1"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`画像 ${i + 1}`}
                >
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    {i + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* B. PROPERTY SUMMARY CARD */}
          <div className="rounded-lg border border-border bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="new-badge shadow-sm">11/26 登録 NEW</span>
              <span className="category-badge shadow-sm">区分マンション</span>
            </div>

            <h1 className="mb-3 text-xl font-bold text-primary-dark md:text-2xl">
              東京都大田区 区分マンション
            </h1>

            <div className="mb-4 flex flex-wrap items-baseline gap-3">
              <p className="property-price">5億8,000万円</p>
              <span className="yield-badge">表面利回り 6.2%</span>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
              {[
                { icon: MapPin, label: "所在地", value: "東京都大田区上池台4" },
                {
                  icon: TrainFront,
                  label: "交通",
                  value: "東急池上線 長原駅 徒歩1分",
                },
                {
                  icon: Calendar,
                  label: "築年数",
                  value: "2000年10月（築25年）",
                },
                { icon: Building, label: "構造", value: "RC造 地上5階建" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div>
                    <p className="text-xs font-medium text-muted">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
              {[
                { label: "土地面積", value: "250.32㎡" },
                { label: "建物面積", value: "180.45㎡" },
                { label: "満室想定", value: "600万円/年" },
                { label: "現況利回り", value: "6.2%" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <div className="mt-0.5 h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-muted">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. TABS SECTION */}
          <div className="rounded-lg border border-border bg-white shadow-sm">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-border">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === i
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-5">
              {/* Tab 0: オンサイト経費内訳明細 */}
              {activeTab === 0 && (
                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-dark">
                    年間経費内訳
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-primary bg-gray-50">
                        <th className="px-4 py-2.5 text-left font-semibold text-gray-700">
                          項目
                        </th>
                        <th className="px-4 py-2.5 text-right font-semibold text-gray-700">
                          年間額（円）
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXPENSE_DATA.map((item) => (
                        <tr
                          key={item.label}
                          className="border-b border-border transition-colors hover:bg-gray-50"
                        >
                          <td className="px-4 py-2.5 text-foreground">
                            {item.label}
                          </td>
                          <td className="px-4 py-2.5 text-right font-medium tabular-nums text-foreground">
                            ¥{item.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-primary bg-blue-50">
                        <td className="px-4 py-2.5 font-bold text-primary-dark">
                          合計
                        </td>
                        <td className="px-4 py-2.5 text-right font-bold tabular-nums text-primary-dark">
                          ¥
                          {EXPENSE_DATA.reduce(
                            (sum, e) =>
                              sum + Number(e.amount.replace(/,/g, "")),
                            0
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Tab 1: 基本情報 */}
              {activeTab === 1 && (
                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-dark">
                    物件基本情報
                  </h3>
                  <table className="w-full text-sm">
                    <tbody>
                      {BASIC_INFO.map(([label, value]) => (
                        <tr
                          key={label}
                          className="border-b border-border transition-colors hover:bg-gray-50"
                        >
                          <th className="w-1/3 bg-gray-50 px-4 py-2.5 text-left font-semibold text-gray-700">
                            {label}
                          </th>
                          <td className="px-4 py-2.5 text-foreground">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: 地図 */}
              {activeTab === 2 && (
                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-dark">
                    所在地マップ
                  </h3>
                  <div className="mb-3 flex items-center gap-2 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    東京都大田区上池台4
                  </div>
                  <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-gray-100 text-sm text-muted sm:h-80 md:h-96">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                      <p>Google Maps 埋め込みエリア</p>
                      <p className="mt-1 text-xs text-gray-400">
                        東京都大田区上池台4
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: 収支シミュレーション */}
              {activeTab === 3 && (
                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-dark">
                    収支シミュレーション
                  </h3>

                  {/* Input Fields */}
                  <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        自己資金（万円）
                      </label>
                      <input
                        type="number"
                        value={equity}
                        onChange={(e) => setEquity(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        借入金（万円）
                      </label>
                      <input
                        type="number"
                        value={loan}
                        onChange={(e) => setLoan(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        金利（%）
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-700">
                        借入期間（年）
                      </label>
                      <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
                      />
                    </div>
                  </div>

                  {/* Output */}
                  <div className="rounded-lg border border-border bg-gray-50 p-5">
                    <h4 className="mb-3 text-sm font-bold text-primary-dark">
                      シミュレーション結果
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-md bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-muted">
                          月額返済額
                        </p>
                        <p className="text-xl font-bold tabular-nums text-primary-dark">
                          {monthlyPayment.toFixed(1)}
                          <span className="ml-1 text-sm font-normal text-muted">
                            万円
                          </span>
                        </p>
                      </div>
                      <div className="rounded-md bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-muted">
                          年間返済額
                        </p>
                        <p className="text-xl font-bold tabular-nums text-primary-dark">
                          {annualLoanPayment.toFixed(1)}
                          <span className="ml-1 text-sm font-normal text-muted">
                            万円
                          </span>
                        </p>
                      </div>
                      <div className="rounded-md bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-muted">
                          年間満室収入
                        </p>
                        <p className="text-xl font-bold tabular-nums text-primary-dark">
                          {annualIncome.toFixed(1)}
                          <span className="ml-1 text-sm font-normal text-muted">
                            万円
                          </span>
                        </p>
                      </div>
                      <div className="rounded-md bg-white p-4 shadow-sm">
                        <p className="text-xs font-medium text-muted">
                          年間経費
                        </p>
                        <p className="text-xl font-bold tabular-nums text-primary-dark">
                          {annualExpense.toFixed(1)}
                          <span className="ml-1 text-sm font-normal text-muted">
                            万円
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Cash Flow */}
                    <div className="mt-4 rounded-md border-2 border-primary bg-blue-50 p-4">
                      <p className="text-xs font-semibold text-primary">
                        年間キャッシュフロー
                      </p>
                      <p
                        className={`text-2xl font-extrabold tabular-nums ${
                          cashFlow >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {cashFlow >= 0 ? "+" : ""}
                        {cashFlow.toFixed(1)}
                        <span className="ml-1 text-sm font-normal text-muted">
                          万円
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        収入 {annualIncome.toFixed(1)}万円 − 経費{" "}
                        {annualExpense.toFixed(1)}万円 − 返済{" "}
                        {annualLoanPayment.toFixed(1)}万円
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: 類似物件 */}
              {activeTab === 4 && (
                <div>
                  <h3 className="mb-4 text-base font-bold text-primary-dark">
                    類似物件
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {RELATED_PROPERTIES.slice(0, 4).map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (40%) ===== */}
        <div className="space-y-6 lg:w-2/5">
          {/* D. STICKY ACTION CARD */}
          <div className="lg:sticky lg:top-20">
            <div className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-primary-dark">
                この物件に問い合わせる
              </h3>

              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex w-full items-center justify-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${
                    isFavorite
                      ? "border border-red-300 bg-red-50 text-red-600"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isFavorite
                    ? "お気に入り済み"
                    : "お気に入りに登録"}
                  <span className="ml-1 text-xs text-muted">85人</span>
                </button>

                <Link
                  href={`/inquiry?property=${id}`}
                  className="btn-primary w-full px-6 py-2.5 font-medium no-underline"
                >
                  <FileText className="h-4 w-4" />
                  物件詳細資料
                </Link>

                <Link
                  href={`/inquiry?property=${id}`}
                  className="btn-success w-full px-6 py-2.5 font-medium no-underline"
                >
                  <Mail className="h-4 w-4" />
                  問合せする
                </Link>
              </div>

              <p className="text-center text-xs text-muted">
                ※ 会員登録（無料）が必要です
              </p>
            </div>

            {/* E. SELLER INFO CARD */}
            <div className="mt-6 rounded-lg border border-border bg-white p-5 shadow-sm">
              <h3 className="mb-4 border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
                売主情報
              </h3>

              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Building className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    株式会社サンプル不動産
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    東京都知事（3）第12345号
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-foreground">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                  東京都港区赤坂1-2-3
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  info@sample-fudosan.co.jp
                </p>
              </div>

              <Link
                href={`/inquiry?property=${id}`}
                className="btn-secondary mt-4 w-full px-6 py-2.5 font-medium no-underline"
              >
                <Mail className="h-4 w-4" />
                この会社に問い合わせ
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RELATED PROPERTIES SECTION ===== */}
      <section className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-primary-dark">
          同じエリアの類似物件
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {RELATED_PROPERTIES.map((property) => (
            <div key={property.id} className="w-72 shrink-0">
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

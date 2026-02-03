"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import type { PropertyCardProps } from "@/components/PropertyCard";

/* ============================================
   Dummy Data
   ============================================ */

const DUMMY_PROPERTIES: PropertyCardProps[] = [
  {
    id: 1,
    title: "東京都大田区 区分マンション",
    category: "区分マンション",
    price: 58000,
    yield: 6.2,
    location: "東京都大田区上池台4",
    station: "東急池上線 長原駅",
    walkTime: "徒歩1分",
    builtYear: "2000年10月",
    age: 25,
    structure: "RC造",
    image: "",
    registeredDate: "11/26",
    isNew: true,
  },
  {
    id: 2,
    title: "東京都品川区 一棟アパート",
    category: "一棟アパート",
    price: 12500,
    yield: 7.8,
    location: "東京都品川区西五反田3",
    station: "JR山手線 五反田駅",
    walkTime: "徒歩8分",
    builtYear: "1995年3月",
    age: 30,
    structure: "鉄骨造",
    image: "",
    registeredDate: "11/25",
    isNew: true,
  },
  {
    id: 3,
    title: "東京都目黒区 一棟マンション",
    category: "一棟マンション",
    price: 34000,
    yield: 5.5,
    location: "東京都目黒区中目黒2",
    station: "東急東横線 中目黒駅",
    walkTime: "徒歩5分",
    builtYear: "2010年7月",
    age: 15,
    structure: "RC造",
    image: "",
    registeredDate: "11/24",
    isNew: true,
  },
  {
    id: 4,
    title: "東京都世田谷区 一棟アパート",
    category: "一棟アパート",
    price: 8900,
    yield: 8.3,
    location: "東京都世田谷区経堂1",
    station: "小田急線 経堂駅",
    walkTime: "徒歩6分",
    builtYear: "1990年5月",
    age: 35,
    structure: "木造",
    image: "",
    registeredDate: "11/23",
    isNew: false,
  },
  {
    id: 5,
    title: "東京都新宿区 一棟ビル",
    category: "一棟ビル",
    price: 45000,
    yield: 5.9,
    location: "東京都新宿区西新宿7",
    station: "JR中央線 新宿駅",
    walkTime: "徒歩10分",
    builtYear: "1998年11月",
    age: 27,
    structure: "SRC造",
    image: "",
    registeredDate: "11/22",
    isNew: false,
  },
  {
    id: 6,
    title: "東京都渋谷区 区分マンション",
    category: "区分マンション",
    price: 5680,
    yield: 6.7,
    location: "東京都渋谷区恵比寿南1",
    station: "JR山手線 恵比寿駅",
    walkTime: "徒歩3分",
    builtYear: "2005年2月",
    age: 20,
    structure: "RC造",
    image: "",
    registeredDate: "11/21",
    isNew: false,
  },
  {
    id: 7,
    title: "東京都中野区 一棟アパート",
    category: "一棟アパート",
    price: 10800,
    yield: 9.1,
    location: "東京都中野区新井1",
    station: "JR中央線 中野駅",
    walkTime: "徒歩7分",
    builtYear: "1988年8月",
    age: 37,
    structure: "木造",
    image: "",
    registeredDate: "11/20",
    isNew: false,
  },
  {
    id: 8,
    title: "東京都豊島区 一棟マンション",
    category: "一棟マンション",
    price: 23000,
    yield: 7.2,
    location: "東京都豊島区池袋本町2",
    station: "JR山手線 池袋駅",
    walkTime: "徒歩12分",
    builtYear: "2001年4月",
    age: 24,
    structure: "RC造",
    image: "",
    registeredDate: "11/19",
    isNew: false,
  },
  {
    id: 9,
    title: "東京都杉並区 戸建",
    category: "戸建",
    price: 7200,
    yield: 10.2,
    location: "東京都杉並区荻窪5",
    station: "JR中央線 荻窪駅",
    walkTime: "徒歩4分",
    builtYear: "1985年6月",
    age: 40,
    structure: "木造",
    image: "",
    registeredDate: "11/18",
    isNew: false,
  },
  {
    id: 10,
    title: "東京都板橋区 一棟アパート",
    category: "一棟アパート",
    price: 9500,
    yield: 8.8,
    location: "東京都板橋区板橋1",
    station: "都営三田線 板橋区役所前駅",
    walkTime: "徒歩2分",
    builtYear: "2015年1月",
    age: 10,
    structure: "鉄骨造",
    image: "",
    registeredDate: "11/17",
    isNew: false,
  },
];

/* ============================================
   Filter Data
   ============================================ */

const CATEGORIES = [
  "区分マンション",
  "一棟アパート",
  "一棟マンション",
  "一棟ビル",
  "区分店舗",
  "戸建",
  "借地権",
  "店舗",
  "工場・倉庫",
  "土地",
  "その他",
];

const QUICK_FILTERS = [
  "区分マンション",
  "一棟アパート",
  "一棟マンション",
  "一棟ビル",
  "戸建",
  "店舗",
  "土地",
];

const PRICE_OPTIONS = [
  "下限なし",
  "100万円",
  "300万円",
  "500万円",
  "1000万円",
  "3000万円",
  "5000万円",
  "1億円",
  "3億円",
  "5億円",
  "10億円",
];

const YIELD_OPTIONS = [
  "下限なし",
  "3%",
  "5%",
  "7%",
  "10%",
  "15%",
  "20%",
  "30%",
];

const WALK_MINUTES = [
  "指定なし",
  "3分以内",
  "5分以内",
  "7分以内",
  "10分以内",
  "15分以内",
  "20分以内",
];

const STRUCTURES = ["SRC造", "RC造", "鉄骨造", "木造", "ブロック造", "その他"];

const ZONING = [
  "第一種低層住居",
  "第二種低層住居",
  "第一種中高層住居",
  "第二種中高層住居",
  "第一種住居",
  "第二種住居",
  "準住居",
  "近隣商業",
  "商業",
  "準工業",
  "工業",
  "工業専用",
  "その他",
];

/* ============================================
   Collapsible Filter Section
   ============================================ */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-gray-700"
        aria-expanded={open}
      >
        {title}
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

/* ============================================
   Range Dropdown Pair
   ============================================ */

function RangeSelect({
  options,
  labelMin = "下限なし",
  labelMax = "上限なし",
}: {
  options: string[];
  labelMin?: string;
  labelMax?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <select
        className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        defaultValue=""
        aria-label={labelMin}
      >
        <option value="">{labelMin}</option>
        {options
          .filter((o) => o !== "下限なし" && o !== "上限なし")
          .map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
      <span className="shrink-0 text-xs text-gray-400">〜</span>
      <select
        className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
        defaultValue=""
        aria-label={labelMax}
      >
        <option value="">{labelMax}</option>
        {options
          .filter((o) => o !== "下限なし" && o !== "上限なし")
          .map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
      </select>
    </div>
  );
}

/* ============================================
   Page Component
   ============================================ */

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(
    null
  );
  const [walkMinute, setWalkMinute] = useState("指定なし");
  const totalCount = "13,538";

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="bg-blue-900 py-8 text-center text-white">
        <div className="mx-auto max-w-350 px-4">
          <h1 className="text-2xl font-bold tracking-tight text-white md:text-4xl">
            全国の一棟収益不動産ポータルサイト
          </h1>
          <p className="mt-4 text-sm font-medium text-blue-200">掲載物件</p>
          <p className="text-5xl font-extrabold tracking-tight md:text-6xl">
            <span className="text-red-500">{totalCount}</span>
            <span className="ml-1 text-lg font-normal text-blue-200">件</span>
          </p>

          {/* Quick Filter Pills */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() =>
                  setActiveQuickFilter(
                    activeQuickFilter === filter ? null : filter
                  )
                }
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  activeQuickFilter === filter
                    ? "bg-yellow-400 text-gray-900 shadow-md"
                    : "bg-blue-800 text-white hover:bg-blue-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="mx-auto max-w-350 px-4 py-6">
        {/* Mobile sidebar toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
          aria-expanded={sidebarOpen}
          aria-controls="filter-sidebar"
        >
          {sidebarOpen ? (
            <>
              <X className="h-5 w-5" />
              フィルターを閉じる
            </>
          ) : (
            <>
              <SlidersHorizontal className="h-5 w-5" />
              フィルターを開く
            </>
          )}
        </button>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ===== LEFT SIDEBAR (1/4) ===== */}
          <aside
            id="filter-sidebar"
            className={`w-full shrink-0 lg:w-1/4 ${
              sidebarOpen ? "block" : "hidden"
            } lg:sticky lg:top-36 lg:block`}
          >
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="border-b-2 border-blue-600 pb-2 text-base font-bold text-gray-900">
                東京都を絞る
              </h3>

              {/* A. カテゴリー */}
              <FilterSection title="カテゴリー">
                <div className="grid grid-cols-2 gap-x-2">
                  {CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      className="flex cursor-pointer items-center gap-2 py-1 text-xs font-medium text-gray-600"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                      {cat}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* B. 価格 */}
              <FilterSection title="価格">
                <RangeSelect options={PRICE_OPTIONS} />
              </FilterSection>

              {/* C. 表面利回り */}
              <FilterSection title="表面利回り">
                <RangeSelect options={YIELD_OPTIONS} />
              </FilterSection>

              {/* D. 駅までの徒歩距離 */}
              <FilterSection title="駅までの徒歩距離">
                <div className="space-y-0.5">
                  {WALK_MINUTES.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2 py-1 text-xs font-medium text-gray-600"
                    >
                      <input
                        type="radio"
                        name="walk"
                        className="h-4 w-4 accent-blue-600"
                        checked={walkMinute === opt}
                        onChange={() => setWalkMinute(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* E. 築年数 */}
              <FilterSection title="築年数" defaultOpen={false}>
                <RangeSelect
                  options={[
                    "下限なし",
                    "1年",
                    "3年",
                    "5年",
                    "10年",
                    "15年",
                    "20年",
                    "25年",
                    "30年",
                    "35年",
                    "40年",
                  ]}
                />
              </FilterSection>

              {/* F. 建物構造 */}
              <FilterSection title="建物構造" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-x-2">
                  {STRUCTURES.map((s) => (
                    <label
                      key={s}
                      className="flex cursor-pointer items-center gap-2 py-1 text-xs font-medium text-gray-600"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* G. 積算率 */}
              <FilterSection title="積算率" defaultOpen={false}>
                <RangeSelect
                  options={[
                    "下限なし",
                    "50%",
                    "70%",
                    "80%",
                    "90%",
                    "100%",
                    "120%",
                    "150%",
                  ]}
                />
              </FilterSection>

              {/* H. 乖離（売価/積算） */}
              <FilterSection title="乖離（売価/積算）" defaultOpen={false}>
                <RangeSelect
                  options={[
                    "下限なし",
                    "50%",
                    "70%",
                    "80%",
                    "90%",
                    "100%",
                    "120%",
                    "150%",
                  ]}
                />
              </FilterSection>

              {/* I. 面積 */}
              <FilterSection title="面積" defaultOpen={false}>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="㎡"
                    className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                    aria-label="面積下限"
                  />
                  <span className="shrink-0 text-xs text-gray-400">〜</span>
                  <input
                    type="number"
                    placeholder="㎡"
                    className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                    aria-label="面積上限"
                  />
                </div>
              </FilterSection>

              {/* J. 用途地域 */}
              <FilterSection title="用途地域" defaultOpen={false}>
                <div className="grid grid-cols-2 gap-x-2">
                  {ZONING.map((z) => (
                    <label
                      key={z}
                      className="flex cursor-pointer items-center gap-2 py-1 text-[11px] font-medium text-gray-600"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                      {z}
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* K. 通知頻度 */}
              <FilterSection title="通知頻度" defaultOpen={false}>
                <select
                  className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                  defaultValue="1週間"
                  aria-label="通知頻度"
                >
                  <option>毎日</option>
                  <option>3日</option>
                  <option>1週間</option>
                  <option>2週間</option>
                  <option>1ヶ月</option>
                </select>
              </FilterSection>

              {/* Bottom Buttons */}
              <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
                <button
                  type="button"
                  className="w-full rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  この条件をクリア
                </button>
                <button
                  type="button"
                  className="w-full rounded-md bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 sm:w-auto"
                >
                  条件を保存する
                </button>
              </div>
            </div>
          </aside>

          {/* ===== RIGHT: PROPERTY GRID (3/4) ===== */}
          <div className="min-w-0 flex-1 space-y-6 lg:w-3/4">
            {/* Sort header */}
            <div className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                <span className="text-base font-bold text-gray-900">
                  {totalCount}件
                </span>{" "}
                の物件が見つかりました
              </p>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                defaultValue="new"
                aria-label="並び替え"
              >
                <option value="new">新着順</option>
                <option value="price-low">価格が安い順</option>
                <option value="price-high">価格が高い順</option>
                <option value="yield-high">利回りが高い順</option>
                <option value="station">駅が近い順</option>
                <option value="year-new">築年数が新しい順</option>
              </select>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DUMMY_PROPERTIES.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>

            {/* Pagination */}
            <nav
              className="flex items-center justify-center gap-1.5"
              aria-label="ページネーション"
            >
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    page === 1
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-current={page === 1 ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
              <span className="px-1 text-gray-400">...</span>
              <button
                type="button"
                className="flex items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                次へ &raquo;
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
   Filter Chip Types
   ============================================ */

interface FilterChip {
  key: string;
  label: string;
  paramKey: string;
}

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
    <div className="border-b border-border py-3">
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
        className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
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
        className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
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

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walkMinute, setWalkMinute] = useState("指定なし");

  const totalCount = "13,538";

  /* Build active filter chips from URL params */
  const activeChips: FilterChip[] = [];

  const area = searchParams.get("area");
  if (area) {
    activeChips.push({ key: `area-${area}`, label: area, paramKey: "area" });
  } else {
    activeChips.push({
      key: "area-tokyo",
      label: "東京都",
      paramKey: "area",
    });
  }

  const category = searchParams.get("category");
  if (category) {
    activeChips.push({
      key: `category-${category}`,
      label: category,
      paramKey: "category",
    });
  }

  const minPrice = searchParams.get("minPrice");
  if (minPrice) {
    activeChips.push({
      key: `minPrice-${minPrice}`,
      label: `価格: ${minPrice}以上`,
      paramKey: "minPrice",
    });
  } else {
    activeChips.push({
      key: "minPrice-default",
      label: "価格: 5000万円以上",
      paramKey: "minPrice",
    });
  }

  const minYield = searchParams.get("minYield");
  if (minYield) {
    activeChips.push({
      key: `minYield-${minYield}`,
      label: `利回り: ${minYield}以上`,
      paramKey: "minYield",
    });
  } else {
    activeChips.push({
      key: "minYield-default",
      label: "利回り: 7%以上",
      paramKey: "minYield",
    });
  }

  const sort = searchParams.get("sort") || "new";

  /* Remove a filter chip */
  const removeChip = (paramKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(paramKey);
    router.push(`/search?${params.toString()}`);
  };

  /* Clear all filters */
  const clearAll = () => {
    router.push("/search");
  };

  return (
    <div className="mx-auto max-w-350 px-4 py-6">
      {/* ===== ACTIVE FILTERS BAR ===== */}
      <div className="mb-6 rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-primary-dark">
            検索条件を絞る
          </h2>
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium text-muted transition-colors hover:text-secondary"
          >
            すべてクリア
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-blue-50 px-3 py-1.5 text-xs font-medium text-primary"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => removeChip(chip.paramKey)}
                className="flex h-4 w-4 items-center justify-center rounded-full transition-colors hover:bg-primary/10"
                aria-label={`${chip.label} を削除`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ===== RESULTS COUNT + SORT ===== */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          該当物件{" "}
          <span className="text-xl font-bold text-gray-900">
            {totalCount}
          </span>{" "}
          件
        </p>
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
          defaultValue={sort}
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

      {/* ===== MOBILE SIDEBAR TOGGLE ===== */}
      <button
        type="button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
        aria-expanded={sidebarOpen}
        aria-controls="search-filter-sidebar"
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

      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside
          id="search-filter-sidebar"
          className={`shrink-0 ${
            sidebarOpen ? "block" : "hidden"
          } w-full lg:sticky lg:top-36 lg:block lg:w-1/4`}
        >
          <div className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-sm">
            <h3 className="border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
              条件で絞り込む
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
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                      defaultChecked={category === cat}
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
                      className="h-4 w-4 accent-primary"
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
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
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
                  className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
                  aria-label="面積下限"
                />
                <span className="shrink-0 text-xs text-gray-400">〜</span>
                <input
                  type="number"
                  placeholder="㎡"
                  className="w-full rounded-md border border-gray-300 px-2.5 py-2 text-xs focus:border-primary-light focus:ring-1 focus:ring-primary-light/30"
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
                      className="h-4 w-4 rounded border-gray-300 accent-primary"
                    />
                    {z}
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Bottom Buttons */}
            <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={clearAll}
                className="w-full rounded-md border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
              >
                この条件をクリア
              </button>
              <button
                type="button"
                className="w-full rounded-md bg-secondary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#b91c1c] sm:w-auto"
              >
                条件を保存する
              </button>
            </div>
          </div>
        </aside>

        {/* ===== RIGHT: PROPERTY GRID ===== */}
        <div className="min-w-0 flex-1 space-y-6 lg:w-3/4">
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
                    ? "bg-primary text-white shadow-sm"
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
  );
}

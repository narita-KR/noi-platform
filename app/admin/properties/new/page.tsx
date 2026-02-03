"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Upload,
  Plus,
  Trash2,
  Eye,
  Save,
  X,
  ImageIcon,
} from "lucide-react";

/* ============================================
   Constants
   ============================================ */

const CATEGORIES = [
  "区分マンション",
  "一棟アパート",
  "一棟マンション",
  "一棟ビル",
  "店舗・事務所",
  "土地",
];

const STATUSES = ["公開中", "下書き", "非公開"];

const STRUCTURES = [
  "RC造（鉄筋コンクリート）",
  "SRC造（鉄骨鉄筋コンクリート）",
  "鉄骨造",
  "木造",
  "軽量鉄骨造",
  "その他",
];

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const FACILITIES = [
  "エアコン",
  "駐車場",
  "エレベーター",
  "オートロック",
  "宅配ボックス",
  "BS/CS",
  "インターネット無料",
  "追い焚き",
  "浴室乾燥機",
  "ウォシュレット",
  "モニター付きインターホン",
  "防犯カメラ",
];

const SELLERS = [
  { id: 1, name: "山田不動産" },
  { id: 2, name: "鈴木ホーム" },
  { id: 3, name: "伊藤リアルティ" },
  { id: 4, name: "加藤住宅" },
  { id: 5, name: "渡辺不動産" },
];

/* ============================================
   Types
   ============================================ */

interface AccessPoint {
  line: string;
  station: string;
  walkMinutes: string;
}

interface ImageFile {
  id: string;
  name: string;
}

/* ============================================
   Accordion Section Component
   ============================================ */

function Section({
  title,
  tag,
  defaultOpen = true,
  children,
}: {
  title: string;
  tag: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
            {tag}
          </span>
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        {open ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="border-t border-gray-100 px-6 py-5">{children}</div>
      )}
    </div>
  );
}

/* ============================================
   Field helpers
   ============================================ */

function Label({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-semibold text-gray-700"
    >
      {children}
      {required && (
        <span className="ml-1 text-xs font-bold text-red-500">必須</span>
      )}
    </label>
  );
}

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const selectCls =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

const errorCls = "mt-1 text-xs font-medium text-red-500";

/* ============================================
   Page Component
   ============================================ */

export default function NewPropertyPage() {
  /* --- A: Basic --- */
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState("下書き");
  const [price, setPrice] = useState("");
  const [surfaceYield, setSurfaceYield] = useState("");

  /* --- B: Location --- */
  const [postalCode, setPostalCode] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");

  /* --- C: Access --- */
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([
    { line: "", station: "", walkMinutes: "" },
  ]);

  /* --- D: Building --- */
  const [builtYear, setBuiltYear] = useState("");
  const [builtMonth, setBuiltMonth] = useState("");
  const [structure, setStructure] = useState(STRUCTURES[0]);
  const [floors, setFloors] = useState("");
  const [landArea, setLandArea] = useState("");
  const [buildingArea, setBuildingArea] = useState("");

  /* --- E: Revenue --- */
  const [fullIncome, setFullIncome] = useState("");
  const [currentIncome, setCurrentIncome] = useState("");
  const [appraisal, setAppraisal] = useState("");

  /* --- F: Images --- */
  const [mainImage, setMainImage] = useState<ImageFile | null>(null);
  const [subImages, setSubImages] = useState<ImageFile[]>([]);

  /* --- G: Detail --- */
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  /* --- H: Seller --- */
  const [sellerId, setSellerId] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  /* --- Validation --- */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* --- Auto-calculate yield --- */
  const calculatedYield =
    price && fullIncome
      ? ((parseFloat(fullIncome) / parseFloat(price)) * 100).toFixed(2)
      : "";

  /* --- Access point management --- */
  const addAccessPoint = () => {
    setAccessPoints((prev) => [
      ...prev,
      { line: "", station: "", walkMinutes: "" },
    ]);
  };

  const removeAccessPoint = (index: number) => {
    setAccessPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAccessPoint = (
    index: number,
    field: keyof AccessPoint,
    value: string
  ) => {
    setAccessPoints((prev) =>
      prev.map((ap, i) => (i === index ? { ...ap, [field]: value } : ap))
    );
  };

  /* --- Facility toggle --- */
  const toggleFacility = (name: string) => {
    setFacilities((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name]
    );
  };

  /* --- Image upload (mock) --- */
  const handleMainImage = useCallback(() => {
    setMainImage({ id: crypto.randomUUID(), name: "main_image.jpg" });
  }, []);

  const handleSubImages = useCallback(() => {
    if (subImages.length >= 8) return;
    setSubImages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `sub_image_${prev.length + 1}.jpg` },
    ]);
  }, [subImages.length]);

  const removeSubImage = (id: string) => {
    setSubImages((prev) => prev.filter((img) => img.id !== id));
  };

  /* --- Postal lookup (mock) --- */
  const handlePostalLookup = () => {
    if (postalCode.replace("-", "").length === 7) {
      setPrefecture("東京都");
      setCity("港区赤坂");
    }
  };

  /* --- Validate --- */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "物件名を入力してください";
    if (!price.trim()) e.price = "価格を入力してください";
    if (!prefecture) e.prefecture = "都道府県を選択してください";
    if (!city.trim()) e.city = "市区町村を入力してください";
    if (!address.trim()) e.address = "番地を入力してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* --- Submit --- */
  const handleSubmit = (submitStatus: string) => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    console.log("Submit property:", {
      status: submitStatus,
      basic: { title, category, price, surfaceYield: surfaceYield || calculatedYield },
      location: { postalCode, prefecture, city, address, building },
      access: accessPoints,
      building: { builtYear, builtMonth, structure, floors, landArea, buildingArea },
      revenue: { fullIncome, currentIncome, appraisal },
      images: { mainImage, subImages },
      detail: { description, facilities, remarks },
      seller: { sellerId, contactName, contactPhone },
    });
  };

  return (
    <div className="pb-24">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="mb-6 space-y-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link
            href="/admin"
            className="text-gray-500 no-underline hover:text-blue-600"
          >
            ダッシュボード
          </Link>
          <span>/</span>
          <Link
            href="/admin/properties"
            className="text-gray-500 no-underline hover:text-blue-600"
          >
            物件管理
          </Link>
          <span>/</span>
          <span className="text-gray-700">新規登録</span>
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">新規物件登録</h1>
          <Link
            href="/admin/properties"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline transition-colors hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            物件一覧に戻る
          </Link>
        </div>
      </div>

      {/* ===== 2. FORM SECTIONS ===== */}
      <div className="space-y-5">
        {/* ===== SECTION A: 基本情報 ===== */}
        <Section title="基本情報" tag="A">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Title (full width) */}
            <div className="sm:col-span-2">
              <Label required htmlFor="prop-title">
                物件名
              </Label>
              <input
                id="prop-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例：東京都港区 区分マンション"
                className={inputCls}
              />
              {errors.title && <p className={errorCls}>{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="prop-category">カテゴリー</Label>
              <select
                id="prop-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="prop-status">ステータス</Label>
              <select
                id="prop-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={selectCls}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <Label required htmlFor="prop-price">
                価格
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="5800"
                  className={inputCls}
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  万円
                </span>
              </div>
              {errors.price && <p className={errorCls}>{errors.price}</p>}
            </div>

            {/* Yield */}
            <div>
              <Label htmlFor="prop-yield">表面利回り</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-yield"
                  type="number"
                  value={surfaceYield}
                  onChange={(e) => setSurfaceYield(e.target.value)}
                  placeholder={calculatedYield || "6.2"}
                  className={inputCls}
                  step="0.1"
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  ％
                </span>
              </div>
              {calculatedYield && !surfaceYield && (
                <p className="mt-1 text-xs text-blue-500">
                  自動計算: {calculatedYield}%
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ===== SECTION B: 所在地 ===== */}
        <Section title="所在地" tag="B">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Postal Code */}
            <div>
              <Label htmlFor="prop-postal">郵便番号</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-postal"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="107-0052"
                  className={inputCls}
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={handlePostalLookup}
                  className="shrink-0 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  住所検索
                </button>
              </div>
            </div>

            {/* Prefecture */}
            <div>
              <Label required htmlFor="prop-prefecture">
                都道府県
              </Label>
              <select
                id="prop-prefecture"
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className={selectCls}
              >
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              {errors.prefecture && (
                <p className={errorCls}>{errors.prefecture}</p>
              )}
            </div>

            {/* City */}
            <div>
              <Label required htmlFor="prop-city">
                市区町村
              </Label>
              <input
                id="prop-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="港区赤坂"
                className={inputCls}
              />
              {errors.city && <p className={errorCls}>{errors.city}</p>}
            </div>

            {/* Address */}
            <div>
              <Label required htmlFor="prop-address">
                番地
              </Label>
              <input
                id="prop-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="1-2-3"
                className={inputCls}
              />
              {errors.address && <p className={errorCls}>{errors.address}</p>}
            </div>

            {/* Building */}
            <div className="sm:col-span-2">
              <Label htmlFor="prop-building">建物名</Label>
              <input
                id="prop-building"
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="赤坂タワー 301号室"
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ===== SECTION C: 交通アクセス ===== */}
        <Section title="交通アクセス" tag="C">
          <div className="space-y-4">
            {accessPoints.map((ap, i) => (
              <div
                key={i}
                className="relative grid gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4 sm:grid-cols-3"
              >
                {accessPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAccessPoint(i)}
                    className="absolute right-2 top-2 rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-red-500"
                    aria-label="削除"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div>
                  <Label htmlFor={`access-line-${i}`}>路線名</Label>
                  <input
                    id={`access-line-${i}`}
                    type="text"
                    value={ap.line}
                    onChange={(e) => updateAccessPoint(i, "line", e.target.value)}
                    placeholder="東急池上線"
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label htmlFor={`access-station-${i}`}>駅名</Label>
                  <input
                    id={`access-station-${i}`}
                    type="text"
                    value={ap.station}
                    onChange={(e) =>
                      updateAccessPoint(i, "station", e.target.value)
                    }
                    placeholder="長原駅"
                    className={inputCls}
                  />
                </div>
                <div>
                  <Label htmlFor={`access-walk-${i}`}>徒歩</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id={`access-walk-${i}`}
                      type="number"
                      value={ap.walkMinutes}
                      onChange={(e) =>
                        updateAccessPoint(i, "walkMinutes", e.target.value)
                      }
                      placeholder="5"
                      className={inputCls}
                      min={0}
                    />
                    <span className="shrink-0 text-sm font-medium text-gray-500">
                      分
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAccessPoint}
              className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
            >
              <Plus className="h-4 w-4" />
              アクセスを追加
            </button>
          </div>
        </Section>

        {/* ===== SECTION D: 建物情報 ===== */}
        <Section title="建物情報" tag="D">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Built year/month */}
            <div>
              <Label>築年月</Label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={builtYear}
                  onChange={(e) => setBuiltYear(e.target.value)}
                  placeholder="2005"
                  className={inputCls}
                  min={1950}
                  max={2026}
                />
                <span className="shrink-0 text-sm text-gray-500">年</span>
                <select
                  value={builtMonth}
                  onChange={(e) => setBuiltMonth(e.target.value)}
                  className={selectCls}
                  style={{ maxWidth: 90 }}
                >
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span className="shrink-0 text-sm text-gray-500">月</span>
              </div>
            </div>

            {/* Structure */}
            <div>
              <Label htmlFor="prop-structure">構造</Label>
              <select
                id="prop-structure"
                value={structure}
                onChange={(e) => setStructure(e.target.value)}
                className={selectCls}
              >
                {STRUCTURES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Floors */}
            <div>
              <Label htmlFor="prop-floors">階建</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-floors"
                  type="number"
                  value={floors}
                  onChange={(e) => setFloors(e.target.value)}
                  placeholder="5"
                  className={inputCls}
                  min={1}
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  階建
                </span>
              </div>
            </div>

            {/* Land area */}
            <div>
              <Label htmlFor="prop-land-area">土地面積</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-land-area"
                  type="number"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="120.5"
                  className={inputCls}
                  step="0.01"
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  ㎡
                </span>
              </div>
            </div>

            {/* Building area */}
            <div>
              <Label htmlFor="prop-building-area">建物面積</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-building-area"
                  type="number"
                  value={buildingArea}
                  onChange={(e) => setBuildingArea(e.target.value)}
                  placeholder="250.0"
                  className={inputCls}
                  step="0.01"
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  ㎡
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== SECTION E: 収益情報 ===== */}
        <Section title="収益情報" tag="E">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Full income */}
            <div>
              <Label htmlFor="prop-full-income">満室想定年収</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-full-income"
                  type="number"
                  value={fullIncome}
                  onChange={(e) => setFullIncome(e.target.value)}
                  placeholder="360"
                  className={inputCls}
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  万円
                </span>
              </div>
            </div>

            {/* Current income */}
            <div>
              <Label htmlFor="prop-current-income">現況年収</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-current-income"
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(e.target.value)}
                  placeholder="320"
                  className={inputCls}
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  万円
                </span>
              </div>
            </div>

            {/* Yield (auto-calc) */}
            <div>
              <Label>表面利回り（自動計算）</Label>
              <div className="flex h-11 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm">
                {calculatedYield ? (
                  <span className="font-semibold text-blue-600">
                    {calculatedYield}%
                  </span>
                ) : (
                  <span className="text-gray-400">
                    価格と満室想定年収を入力すると自動計算
                  </span>
                )}
              </div>
            </div>

            {/* Appraisal */}
            <div>
              <Label htmlFor="prop-appraisal">積算評価額</Label>
              <div className="flex items-center gap-2">
                <input
                  id="prop-appraisal"
                  type="number"
                  value={appraisal}
                  onChange={(e) => setAppraisal(e.target.value)}
                  placeholder="4500"
                  className={inputCls}
                />
                <span className="shrink-0 text-sm font-medium text-gray-500">
                  万円
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== SECTION F: 画像アップロード ===== */}
        <Section title="画像アップロード" tag="F">
          <div className="space-y-6">
            {/* Main image */}
            <div>
              <Label>メイン画像</Label>
              {mainImage ? (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex h-16 w-24 items-center justify-center rounded bg-gray-200">
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <span className="flex-1 text-sm text-gray-600">
                    {mainImage.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMainImage(null)}
                    className="rounded p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleMainImage}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500"
                >
                  <Upload className="h-8 w-8" />
                  <span className="text-sm font-medium">
                    クリックまたはドラッグ＆ドロップで画像をアップロード
                  </span>
                  <span className="text-xs">JPG, PNG（最大5MB）</span>
                </button>
              )}
            </div>

            {/* Sub images */}
            <div>
              <Label>
                サブ画像（最大8枚）
              </Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {subImages.map((img) => (
                  <div
                    key={img.id}
                    className="group relative flex h-28 items-center justify-center rounded-lg border border-gray-200 bg-gray-100"
                  >
                    <ImageIcon className="h-8 w-8 text-gray-300" />
                    <button
                      type="button"
                      onClick={() => removeSubImage(img.id)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 max-w-[calc(100%-12px)] truncate text-[10px] text-gray-400">
                      {img.name}
                    </span>
                  </div>
                ))}

                {subImages.length < 8 && (
                  <button
                    type="button"
                    onClick={handleSubImages}
                    className="flex h-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500"
                  >
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-medium">追加</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* ===== SECTION G: 詳細説明 ===== */}
        <Section title="詳細説明" tag="G">
          <div className="space-y-5">
            {/* Description */}
            <div>
              <Label htmlFor="prop-description">物件説明</Label>
              <textarea
                id="prop-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="物件の特徴や魅力を詳しく記入してください"
                rows={8}
                className={inputCls}
              />
            </div>

            {/* Facilities */}
            <div>
              <Label>設備</Label>
              <div className="flex flex-wrap gap-2">
                {FACILITIES.map((f) => (
                  <label
                    key={f}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                      facilities.includes(f)
                        ? "border-blue-400 bg-blue-50 font-medium text-blue-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={facilities.includes(f)}
                      onChange={() => toggleFacility(f)}
                      className="h-3.5 w-3.5 rounded border-gray-300 accent-blue-600"
                    />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <Label htmlFor="prop-remarks">備考</Label>
              <textarea
                id="prop-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="その他の情報があれば記入してください"
                rows={4}
                className={inputCls}
              />
            </div>
          </div>
        </Section>

        {/* ===== SECTION H: 掲載者情報 ===== */}
        <Section title="掲載者情報" tag="H">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* Seller */}
            <div className="sm:col-span-2">
              <Label htmlFor="prop-seller">掲載業者</Label>
              <select
                id="prop-seller"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className={selectCls}
              >
                <option value="">選択してください</option>
                {SELLERS.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Contact name */}
            <div>
              <Label htmlFor="prop-contact-name">担当者名</Label>
              <input
                id="prop-contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="山田 太郎"
                className={inputCls}
              />
            </div>

            {/* Contact phone */}
            <div>
              <Label htmlFor="prop-contact-phone">連絡先</Label>
              <input
                id="prop-contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="03-0000-0000"
                className={inputCls}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* ===== 3. STICKY ACTION BAR ===== */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-6 py-3 shadow-lg lg:left-64">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            href="/admin/properties"
            className="rounded-md border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 no-underline transition-colors hover:bg-red-50"
          >
            キャンセル
          </Link>
          <button
            type="button"
            onClick={() => handleSubmit("下書き")}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <Save className="h-4 w-4" />
            下書きとして保存
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("プレビュー")}
            className="inline-flex items-center gap-1.5 rounded-md border border-blue-600 px-5 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            <Eye className="h-4 w-4" />
            プレビュー
          </button>
          <button
            type="button"
            onClick={() => handleSubmit("公開中")}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            公開する
          </button>
        </div>
      </div>
    </div>
  );
}

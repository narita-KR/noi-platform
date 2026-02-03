"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

/* ============================================
   Constants
   ============================================ */

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

const INTEREST_CATEGORIES = [
  "区分マンション","一棟アパート","一棟マンション","一棟ビル",
  "区分店舗","戸建","借地権","店舗",
  "工場・倉庫","土地","太陽光発電","その他",
];

const INCOME_OPTIONS = [
  "300万円未満","300万円～500万円","500万円～700万円",
  "700万円～1000万円","1000万円～1500万円","1500万円以上",
];

const PURPOSE_OPTIONS = ["1戸","読み物だけ","戸建賃貸"];

const STATUS_OPTIONS = [
  "まだ探していない",
  "資料請求・問合せをした",
  "物件の見学をした",
  "買付・申込みをした",
  "すでに物件を保有している",
];

const BUSINESS_TYPES = [
  "売買仲介","賃貸仲介","賃貸管理","売買（売主）",
  "開発・分譲","コンサルティング","その他",
];

const YEARS = Array.from({ length: 80 }, (_, i) => 2006 - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

/* ============================================
   Form Field Component
   ============================================ */

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-1 text-xs font-bold text-red-500">必須</span>
        )}
      </label>
      {children}
    </div>
  );
}

/* ============================================
   Section Heading
   ============================================ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b-2 border-blue-600 pb-2 text-lg font-semibold text-gray-900">
      {children}
    </h3>
  );
}

/* ============================================
   Page Component
   ============================================ */

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"investor" | "seller">(
    "investor"
  );

  /* --- Investor form state --- */
  const [invEmail, setInvEmail] = useState("");
  const [invPassword, setInvPassword] = useState("");
  const [invPasswordConfirm, setInvPasswordConfirm] = useState("");
  const [invShowPw, setInvShowPw] = useState(false);
  const [invShowPwConfirm, setInvShowPwConfirm] = useState(false);
  const [invLastName, setInvLastName] = useState("");
  const [invFirstName, setInvFirstName] = useState("");
  const [invLastNameKana, setInvLastNameKana] = useState("");
  const [invFirstNameKana, setInvFirstNameKana] = useState("");
  const [invPhone, setInvPhone] = useState("");
  const [invPostal, setInvPostal] = useState("");
  const [invPrefecture, setInvPrefecture] = useState("");
  const [invCity, setInvCity] = useState("");
  const [invAddress, setInvAddress] = useState("");
  const [invBuilding, setInvBuilding] = useState("");
  const [invInterests, setInvInterests] = useState<string[]>([]);
  const [invBirthYear, setInvBirthYear] = useState("");
  const [invBirthMonth, setInvBirthMonth] = useState("");
  const [invBirthDay, setInvBirthDay] = useState("");
  const [invIncome, setInvIncome] = useState("");
  const [invAssets, setInvAssets] = useState("");
  const [invPurpose, setInvPurpose] = useState("");
  const [invStatus, setInvStatus] = useState("");
  const [invMailSubscribe, setInvMailSubscribe] = useState(true);
  const [invAgree, setInvAgree] = useState(false);
  const [invErrors, setInvErrors] = useState<Record<string, string>>({});

  /* --- Publisher form state --- */
  const [pubEmail, setPubEmail] = useState("");
  const [pubPassword, setPubPassword] = useState("");
  const [pubPasswordConfirm, setPubPasswordConfirm] = useState("");
  const [pubShowPw, setPubShowPw] = useState(false);
  const [pubShowPwConfirm, setPubShowPwConfirm] = useState(false);
  const [pubCompanyName, setPubCompanyName] = useState("");
  const [pubLicense, setPubLicense] = useState("");
  const [pubBusinessTypes, setPubBusinessTypes] = useState<string[]>([]);
  const [pubContactLastName, setPubContactLastName] = useState("");
  const [pubContactFirstName, setPubContactFirstName] = useState("");
  const [pubPhone, setPubPhone] = useState("");
  const [pubPostal, setPubPostal] = useState("");
  const [pubPrefecture, setPubPrefecture] = useState("");
  const [pubCity, setPubCity] = useState("");
  const [pubAddress, setPubAddress] = useState("");
  const [pubMailSubscribe, setPubMailSubscribe] = useState(true);
  const [pubAgree, setPubAgree] = useState(false);
  const [pubErrors, setPubErrors] = useState<Record<string, string>>({});

  /* --- Checkbox toggle helpers --- */
  const toggleInterest = (cat: string) => {
    setInvInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBusinessType = (type: string) => {
    setPubBusinessTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  /* --- Postal code search (real API) --- */
  const [invIsSearching, setInvIsSearching] = useState(false);
  const [pubIsSearching, setPubIsSearching] = useState(false);

  const handlePostalSearch = async (
    postalCode: string,
    setPref: (v: string) => void,
    setTargetCity: (v: string) => void,
    setSearching: (v: boolean) => void
  ) => {
    const cleaned = postalCode.replace(/-/g, "");
    if (!cleaned) {
      alert("郵便番号を入力してください");
      return;
    }
    if (cleaned.length !== 7) {
      alert("郵便番号は7桁で入力してください");
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleaned}`
      );
      const data = await response.json();

      if (data.status === 200 && data.results) {
        const result = data.results[0];
        setPref(result.address1);
        setTargetCity(result.address2 + result.address3);
      } else {
        alert("郵便番号が見つかりませんでした");
      }
    } catch (error) {
      console.error("Postal code search error:", error);
      alert("住所検索に失敗しました");
    } finally {
      setSearching(false);
    }
  };

  /* --- Investor validation --- */
  const validateInvestor = (): boolean => {
    const e: Record<string, string> = {};
    if (!invEmail.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invEmail))
      e.email = "有効なメールアドレスを入力してください";
    if (!invPassword) e.password = "パスワードを入力してください";
    else if (invPassword.length < 8)
      e.password = "パスワードは8文字以上で入力してください";
    if (invPassword !== invPasswordConfirm)
      e.passwordConfirm = "パスワードが一致しません";
    if (!invLastName.trim() || !invFirstName.trim())
      e.name = "お名前を入力してください";
    if (!invPhone.trim()) e.phone = "電話番号を入力してください";
    if (!invAgree) e.agree = "利用規約への同意が必要です";
    setInvErrors(e);
    return Object.keys(e).length === 0;
  };

  /* --- Publisher validation --- */
  const validatePublisher = (): boolean => {
    const e: Record<string, string> = {};
    if (!pubEmail.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pubEmail))
      e.email = "有効なメールアドレスを入力してください";
    if (!pubPassword) e.password = "パスワードを入力してください";
    else if (pubPassword.length < 8)
      e.password = "パスワードは8文字以上で入力してください";
    if (pubPassword !== pubPasswordConfirm)
      e.passwordConfirm = "パスワードが一致しません";
    if (!pubCompanyName.trim()) e.company = "会社名を入力してください";
    if (!pubContactLastName.trim() || !pubContactFirstName.trim())
      e.contact = "担当者名を入力してください";
    if (!pubPhone.trim()) e.phone = "電話番号を入力してください";
    if (!pubAgree) e.agree = "利用規約への同意が必要です";
    setPubErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInvestorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInvestor()) return;
    console.log("Investor registration submitted");
  };

  const handlePublisherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePublisher()) return;
    console.log("Publisher registration submitted");
  };

  const inputCls = (hasError: boolean) =>
    `w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
    }`;

  const selectCls =
    "w-full px-4 py-3 border border-gray-300 rounded-lg text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* ===== TAB NAVIGATION ===== */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab("investor")}
              className={`rounded-md px-6 py-2 text-sm font-bold transition-colors ${
                activeTab === "investor"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              無料会員登録
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seller")}
              className={`rounded-md px-6 py-2 text-sm font-bold transition-colors ${
                activeTab === "seller"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              掲載者会員登録
            </button>
          </div>
        </div>

        {/* ===== TAB 1: INVESTOR REGISTRATION ===== */}
        {activeTab === "investor" && (
          <form
            onSubmit={handleInvestorSubmit}
            noValidate
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
              無料会員登録
            </h1>
            <p className="mb-8 text-center text-sm text-gray-500">
              投資家として物件を探す方はこちら
            </p>

            {/* A. ログイン情報 */}
            <section className="mb-8">
              <SectionHeading>ログイン情報</SectionHeading>
              <div className="space-y-4">
                <FormField label="メールアドレス" required>
                  <input
                    type="email"
                    value={invEmail}
                    onChange={(e) => setInvEmail(e.target.value)}
                    placeholder="oooooo@oooooo.oo"
                    className={inputCls(!!invErrors.email)}
                    autoComplete="email"
                  />
                  {invErrors.email && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {invErrors.email}
                    </p>
                  )}
                </FormField>

                <FormField label="パスワード" required>
                  <div className="relative">
                    <input
                      type={invShowPw ? "text" : "password"}
                      value={invPassword}
                      onChange={(e) => setInvPassword(e.target.value)}
                      placeholder="8文字以上"
                      className={`${inputCls(!!invErrors.password)} pr-12`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setInvShowPw(!invShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={invShowPw ? "非表示" : "表示"}
                    >
                      {invShowPw ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {invErrors.password && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {invErrors.password}
                    </p>
                  )}
                </FormField>

                <FormField label="パスワード（確認用）" required>
                  <div className="relative">
                    <input
                      type={invShowPwConfirm ? "text" : "password"}
                      value={invPasswordConfirm}
                      onChange={(e) => setInvPasswordConfirm(e.target.value)}
                      placeholder="パスワードを再入力"
                      className={`${inputCls(!!invErrors.passwordConfirm)} pr-12`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setInvShowPwConfirm(!invShowPwConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={invShowPwConfirm ? "非表示" : "表示"}
                    >
                      {invShowPwConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {invErrors.passwordConfirm && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {invErrors.passwordConfirm}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* B. 基本属性 */}
            <section className="mb-8">
              <SectionHeading>基本属性</SectionHeading>
              <div className="space-y-4">
                <FormField label="お名前" required>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={invLastName}
                      onChange={(e) => setInvLastName(e.target.value)}
                      placeholder="姓"
                      className={inputCls(!!invErrors.name)}
                    />
                    <input
                      type="text"
                      value={invFirstName}
                      onChange={(e) => setInvFirstName(e.target.value)}
                      placeholder="名"
                      className={inputCls(!!invErrors.name)}
                    />
                  </div>
                  {invErrors.name && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {invErrors.name}
                    </p>
                  )}
                </FormField>

                <FormField label="おなまえ（フリガナ）">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={invLastNameKana}
                      onChange={(e) => setInvLastNameKana(e.target.value)}
                      placeholder="セイ"
                      className={inputCls(false)}
                    />
                    <input
                      type="text"
                      value={invFirstNameKana}
                      onChange={(e) => setInvFirstNameKana(e.target.value)}
                      placeholder="メイ"
                      className={inputCls(false)}
                    />
                  </div>
                </FormField>

                <FormField label="電話番号" required>
                  <input
                    type="tel"
                    value={invPhone}
                    onChange={(e) => setInvPhone(e.target.value)}
                    placeholder="090-0000-0000"
                    className={inputCls(!!invErrors.phone)}
                  />
                  {invErrors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {invErrors.phone}
                    </p>
                  )}
                </FormField>

                <FormField label="郵便番号">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={invPostal}
                      onChange={(e) => setInvPostal(e.target.value)}
                      placeholder="000-0000"
                      className={`${inputCls(false)} max-w-44`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePostalSearch(
                          invPostal,
                          setInvPrefecture,
                          setInvCity,
                          setInvIsSearching
                        )
                      }
                      disabled={invIsSearching}
                      className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {invIsSearching ? "検索中..." : "住所検索"}
                    </button>
                  </div>
                </FormField>

                <FormField label="都道府県">
                  <select
                    value={invPrefecture}
                    onChange={(e) => setInvPrefecture(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="市区町村">
                  <input
                    type="text"
                    value={invCity}
                    onChange={(e) => setInvCity(e.target.value)}
                    placeholder="港区赤坂"
                    className={inputCls(false)}
                  />
                </FormField>

                <FormField label="番地">
                  <input
                    type="text"
                    value={invAddress}
                    onChange={(e) => setInvAddress(e.target.value)}
                    placeholder="1-2-3"
                    className={inputCls(false)}
                  />
                </FormField>

                <FormField label="建物名（任意）">
                  <input
                    type="text"
                    value={invBuilding}
                    onChange={(e) => setInvBuilding(e.target.value)}
                    placeholder="○○マンション 101号室"
                    className={inputCls(false)}
                  />
                </FormField>
              </div>
            </section>

            {/* C. 興味条件 */}
            <section className="mb-8">
              <SectionHeading>興味のある物件</SectionHeading>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {INTEREST_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={invInterests.includes(cat)}
                      onChange={() => toggleInterest(cat)}
                      className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </section>

            {/* D. 生年月日 */}
            <section className="mb-8">
              <SectionHeading>生年月日</SectionHeading>
              <div className="grid grid-cols-3 gap-3">
                <select
                  value={invBirthYear}
                  onChange={(e) => setInvBirthYear(e.target.value)}
                  className={selectCls}
                >
                  <option value="">年</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}年
                    </option>
                  ))}
                </select>
                <select
                  value={invBirthMonth}
                  onChange={(e) => setInvBirthMonth(e.target.value)}
                  className={selectCls}
                >
                  <option value="">月</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}月
                    </option>
                  ))}
                </select>
                <select
                  value={invBirthDay}
                  onChange={(e) => setInvBirthDay(e.target.value)}
                  className={selectCls}
                >
                  <option value="">日</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}日
                    </option>
                  ))}
                </select>
              </div>
            </section>

            {/* E. 年収 */}
            <section className="mb-8">
              <SectionHeading>年収</SectionHeading>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {INCOME_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="income"
                      checked={invIncome === opt}
                      onChange={() => setInvIncome(opt)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </section>

            {/* F. 自己資金 */}
            <section className="mb-8">
              <SectionHeading>自己資金</SectionHeading>
              <FormField label="金融資産（単独時・夫婦合算）">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={invAssets}
                    onChange={(e) => setInvAssets(e.target.value)}
                    placeholder="0"
                    className={`${inputCls(false)} max-w-48`}
                  />
                  <span className="shrink-0 text-sm text-gray-600">万円</span>
                </div>
              </FormField>
            </section>

            {/* G. 不動産投資の目的 */}
            <section className="mb-8">
              <SectionHeading>不動産投資の目的</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {PURPOSE_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="purpose"
                      checked={invPurpose === opt}
                      onChange={() => setInvPurpose(opt)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </section>

            {/* H. 現在の状況 */}
            <section className="mb-8">
              <SectionHeading>現在の状況</SectionHeading>
              <select
                value={invStatus}
                onChange={(e) => setInvStatus(e.target.value)}
                className={selectCls}
              >
                <option value="">選択してください</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </section>

            {/* I. メール配信 */}
            <section className="mb-8">
              <SectionHeading>メール配信</SectionHeading>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={invMailSubscribe}
                  onChange={(e) => setInvMailSubscribe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  物件情報やお役立ち情報のメールを受け取る
                </span>
              </label>
            </section>

            {/* J. 利用規約 */}
            <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={invAgree}
                  onChange={(e) => setInvAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  <Link
                    href="/terms"
                    className="font-medium text-blue-600 no-underline hover:underline"
                  >
                    利用規約
                  </Link>
                  、
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 no-underline hover:underline"
                  >
                    個人情報の取り扱い
                  </Link>
                  について同意する
                </span>
              </label>
              {invErrors.agree && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {invErrors.agree}
                </p>
              )}
            </section>

            {/* K. Submit */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-red-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-red-700"
              >
                登録情報を送信する
              </button>
              <p className="text-center text-xs text-gray-500">
                登録後にお送りするメールを受信後、本登録が完了します。
              </p>
            </div>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              すでにアカウントをお持ちの方は
              <Link
                href="/login"
                className="ml-1 font-medium text-blue-600 no-underline hover:underline"
              >
                ログイン
              </Link>
            </p>
          </form>
        )}

        {/* ===== TAB 2: PUBLISHER REGISTRATION ===== */}
        {activeTab === "seller" && (
          <form
            onSubmit={handlePublisherSubmit}
            noValidate
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
              掲載者会員登録
            </h1>
            <p className="mb-8 text-center text-sm text-gray-500">
              物件を掲載する不動産会社の方はこちら
            </p>

            {/* A. ログイン情報 */}
            <section className="mb-8">
              <SectionHeading>ログイン情報</SectionHeading>
              <div className="space-y-4">
                <FormField label="メールアドレス" required>
                  <input
                    type="email"
                    value={pubEmail}
                    onChange={(e) => setPubEmail(e.target.value)}
                    placeholder="oooooo@oooooo.oo"
                    className={inputCls(!!pubErrors.email)}
                    autoComplete="email"
                  />
                  {pubErrors.email && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.email}
                    </p>
                  )}
                </FormField>

                <FormField label="パスワード" required>
                  <div className="relative">
                    <input
                      type={pubShowPw ? "text" : "password"}
                      value={pubPassword}
                      onChange={(e) => setPubPassword(e.target.value)}
                      placeholder="8文字以上"
                      className={`${inputCls(!!pubErrors.password)} pr-12`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setPubShowPw(!pubShowPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={pubShowPw ? "非表示" : "表示"}
                    >
                      {pubShowPw ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {pubErrors.password && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.password}
                    </p>
                  )}
                </FormField>

                <FormField label="パスワード（確認用）" required>
                  <div className="relative">
                    <input
                      type={pubShowPwConfirm ? "text" : "password"}
                      value={pubPasswordConfirm}
                      onChange={(e) => setPubPasswordConfirm(e.target.value)}
                      placeholder="パスワードを再入力"
                      className={`${inputCls(!!pubErrors.passwordConfirm)} pr-12`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setPubShowPwConfirm(!pubShowPwConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={pubShowPwConfirm ? "非表示" : "表示"}
                    >
                      {pubShowPwConfirm ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {pubErrors.passwordConfirm && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.passwordConfirm}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* B. 会社情報 */}
            <section className="mb-8">
              <SectionHeading>会社情報</SectionHeading>
              <div className="space-y-4">
                <FormField label="会社名" required>
                  <input
                    type="text"
                    value={pubCompanyName}
                    onChange={(e) => setPubCompanyName(e.target.value)}
                    placeholder="株式会社○○不動産"
                    className={inputCls(!!pubErrors.company)}
                  />
                  {pubErrors.company && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.company}
                    </p>
                  )}
                </FormField>

                <FormField label="宅建免許番号">
                  <input
                    type="text"
                    value={pubLicense}
                    onChange={(e) => setPubLicense(e.target.value)}
                    placeholder="東京都知事（1）第○○○○○号"
                    className={inputCls(false)}
                  />
                </FormField>

                <FormField label="事業内容">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {BUSINESS_TYPES.map((type) => (
                      <label
                        key={type}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={pubBusinessTypes.includes(type)}
                          onChange={() => toggleBusinessType(type)}
                          className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </FormField>
              </div>
            </section>

            {/* C. 担当者情報 */}
            <section className="mb-8">
              <SectionHeading>担当者情報</SectionHeading>
              <div className="space-y-4">
                <FormField label="担当者名" required>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={pubContactLastName}
                      onChange={(e) => setPubContactLastName(e.target.value)}
                      placeholder="姓"
                      className={inputCls(!!pubErrors.contact)}
                    />
                    <input
                      type="text"
                      value={pubContactFirstName}
                      onChange={(e) => setPubContactFirstName(e.target.value)}
                      placeholder="名"
                      className={inputCls(!!pubErrors.contact)}
                    />
                  </div>
                  {pubErrors.contact && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.contact}
                    </p>
                  )}
                </FormField>

                <FormField label="電話番号" required>
                  <input
                    type="tel"
                    value={pubPhone}
                    onChange={(e) => setPubPhone(e.target.value)}
                    placeholder="03-0000-0000"
                    className={inputCls(!!pubErrors.phone)}
                  />
                  {pubErrors.phone && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {pubErrors.phone}
                    </p>
                  )}
                </FormField>

                <FormField label="郵便番号">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={pubPostal}
                      onChange={(e) => setPubPostal(e.target.value)}
                      placeholder="000-0000"
                      className={`${inputCls(false)} max-w-44`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePostalSearch(
                          pubPostal,
                          setPubPrefecture,
                          setPubCity,
                          setPubIsSearching
                        )
                      }
                      disabled={pubIsSearching}
                      className="shrink-0 whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {pubIsSearching ? "検索中..." : "住所検索"}
                    </button>
                  </div>
                </FormField>

                <FormField label="都道府県">
                  <select
                    value={pubPrefecture}
                    onChange={(e) => setPubPrefecture(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="市区町村・番地">
                  <input
                    type="text"
                    value={pubCity}
                    onChange={(e) => setPubCity(e.target.value)}
                    placeholder="港区赤坂1-2-3"
                    className={inputCls(false)}
                  />
                </FormField>

                <FormField label="建物名">
                  <input
                    type="text"
                    value={pubAddress}
                    onChange={(e) => setPubAddress(e.target.value)}
                    placeholder="○○ビル 5階"
                    className={inputCls(false)}
                  />
                </FormField>
              </div>
            </section>

            {/* D. メール配信 */}
            <section className="mb-8">
              <SectionHeading>メール配信</SectionHeading>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={pubMailSubscribe}
                  onChange={(e) => setPubMailSubscribe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  サービスに関するお知らせメールを受け取る
                </span>
              </label>
            </section>

            {/* E. 利用規約 */}
            <section className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="checkbox"
                  checked={pubAgree}
                  onChange={(e) => setPubAgree(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <span className="text-sm text-gray-600">
                  <Link
                    href="/terms"
                    className="font-medium text-blue-600 no-underline hover:underline"
                  >
                    利用規約
                  </Link>
                  、
                  <Link
                    href="/privacy"
                    className="font-medium text-blue-600 no-underline hover:underline"
                  >
                    個人情報の取り扱い
                  </Link>
                  について同意する
                </span>
              </label>
              {pubErrors.agree && (
                <p className="mt-2 text-xs font-medium text-red-500">
                  {pubErrors.agree}
                </p>
              )}
            </section>

            {/* F. Submit */}
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full rounded-lg bg-red-600 px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-red-700"
              >
                登録情報を送信する
              </button>
              <p className="text-center text-xs text-gray-500">
                登録後にお送りするメールを受信後、本登録が完了します。
              </p>
            </div>

            {/* Login link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              すでにアカウントをお持ちの方は
              <Link
                href="/login"
                className="ml-1 font-medium text-blue-600 no-underline hover:underline"
              >
                ログイン
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

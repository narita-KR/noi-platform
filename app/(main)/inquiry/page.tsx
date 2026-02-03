"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Mail,
  Phone,
  User,
  MapPin,
  LogIn,
} from "lucide-react";

/* ============================================
   Mock Data
   ============================================ */

const MOCK_PROPERTY = {
  id: 1,
  title: "東京都大田区 区分マンション",
  price: "5億8,000万円",
  location: "東京都大田区上池台4",
  station: "東急池上線 長原駅 徒歩1分",
  category: "区分マンション",
  yield: "6.2%",
};

const MOCK_USER = {
  isLoggedIn: false,
  name: "山田 太郎",
  email: "yamada@example.com",
  phone: "090-1234-5678",
};

const INQUIRY_TYPES = [
  "物件資料希望",
  "物件案内希望",
  "融資相談希望",
  "その他",
];

const PRIVACY_TEXT = `個人情報の取り扱いについて

株式会社青山地所（以下「当社」）は、お客様からお預かりした個人情報を適切に管理し、以下の目的のために利用いたします。

1. 利用目的
お客様からいただいた個人情報は、以下の目的で利用いたします。
・物件情報の提供、資料の送付
・お問い合わせへの回答
・サービスの改善、新サービスの開発
・メールマガジン等の配信（ご同意いただいた場合）

2. 第三者への提供
当社は、以下の場合を除き、お客様の個人情報を第三者に提供いたしません。
・お客様の同意がある場合
・法令に基づく場合
・人の生命、身体または財産の保護のために必要がある場合

3. 個人情報の管理
当社は、お客様の個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。

4. 開示・訂正・削除
お客様がご自身の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。

5. お問い合わせ
個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
株式会社青山地所 個人情報担当
東京都港区赤坂
TEL: 03-0000-0000`;

/* ============================================
   Page Component
   ============================================ */

export default function InquiryPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("property");

  const [isLoggedIn] = useState(MOCK_USER.isLoggedIn);
  const [inquiryTypes, setInquiryTypes] = useState<string[]>(["物件資料希望"]);
  const [name, setName] = useState(isLoggedIn ? MOCK_USER.name : "");
  const [email, setEmail] = useState(isLoggedIn ? MOCK_USER.email : "");
  const [phone, setPhone] = useState(isLoggedIn ? MOCK_USER.phone : "");
  const [message, setMessage] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeRegister, setAgreeRegister] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleInquiryType = (type: string) => {
    setInquiryTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (inquiryTypes.length === 0)
      e.types = "お問い合わせの内容を選択してください";
    if (!name.trim()) e.name = "お名前を入力してください";
    if (!email.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "有効なメールアドレスを入力してください";
    if (!agreePrivacy) e.agree = "同意が必要です";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Inquiry submitted:", {
      propertyId,
      inquiryTypes,
      name,
      email,
      phone,
      message,
      agreeRegister,
    });
  };

  const inputClass = (hasError: boolean) =>
    `w-full rounded-md border py-2.5 px-3 text-sm outline-none transition-colors ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
    }`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-primary-dark">
        物件のお問い合わせ
      </h1>

      {/* ===== 1. PROPERTY CARD ===== */}
      {propertyId && (
        <div className="mb-8 rounded-lg border border-border bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-semibold text-muted">
            この物件について問い合わせ
          </p>
          <div className="flex gap-4">
            <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-400">
              物件画像
            </div>
            <div className="min-w-0">
              <div className="mb-1">
                <span className="mr-2 inline-block rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                  {MOCK_PROPERTY.category}
                </span>
              </div>
              <h2 className="text-sm font-bold text-foreground">
                {MOCK_PROPERTY.title}
              </h2>
              <p className="mt-1 text-lg font-bold text-secondary">
                {MOCK_PROPERTY.price}
                <span className="ml-2 text-xs font-medium text-muted">
                  表面利回り {MOCK_PROPERTY.yield}
                </span>
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3 w-3" />
                {MOCK_PROPERTY.location}
              </p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8"
      >
        {/* ===== 2. INQUIRY TYPE ===== */}
        <div>
          <h3 className="mb-3 border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
            お問い合わせの内容
          </h3>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((type) => (
              <label
                key={type}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                  inquiryTypes.includes(type)
                    ? "border-primary bg-blue-50 text-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={inquiryTypes.includes(type)}
                  onChange={() => toggleInquiryType(type)}
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                />
                {type}
              </label>
            ))}
          </div>
          {errors.types && (
            <p className="mt-1 text-xs font-medium text-red-500">
              {errors.types}
            </p>
          )}
        </div>

        {/* ===== 3. USER INFO ===== */}
        <div>
          <h3 className="mb-3 border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
            お客様情報
          </h3>

          {isLoggedIn ? (
            /* Logged in: read-only display */
            <div className="space-y-3 rounded-md bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-muted">お名前</p>
                  <p className="text-sm font-medium text-foreground">
                    {MOCK_USER.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-muted">メールアドレス</p>
                  <p className="text-sm font-medium text-foreground">
                    {MOCK_USER.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-muted">電話番号</p>
                  <p className="text-sm font-medium text-foreground">
                    {MOCK_USER.phone}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Not logged in: login prompt + manual fields */
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 p-4">
                <LogIn className="h-5 w-5 shrink-0 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary-dark">
                    会員の方はログインすると入力が省略できます
                  </p>
                </div>
                <Link
                  href="/login"
                  className="btn-primary shrink-0 px-4 py-2 text-xs font-medium no-underline"
                >
                  ログイン
                </Link>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  お名前
                  <span className="ml-1 text-xs font-bold text-red-500">
                    必須
                  </span>
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="山田 太郎"
                    className={`${inputClass(!!errors.name)} pl-10`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  メールアドレス
                  <span className="ml-1 text-xs font-bold text-red-500">
                    必須
                  </span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="oooooo@oooooo.oo"
                    className={`${inputClass(!!errors.email)} pl-10`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  電話番号
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="090-0000-0000"
                    className={`${inputClass(false)} pl-10`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== 4. MESSAGE ===== */}
        <div>
          <h3 className="mb-3 border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
            メッセージ
          </h3>
          <div className="relative">
            <FileText className="pointer-events-none absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ご質問やご要望をご記入ください"
              rows={6}
              className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
            />
          </div>
        </div>

        {/* ===== 5. PRIVACY POLICY ===== */}
        <div>
          <h3 className="mb-3 border-b-2 border-primary pb-2 text-base font-bold text-primary-dark">
            個人情報の取り扱いについて
          </h3>
          <div className="h-48 overflow-y-auto rounded-md border border-gray-300 bg-gray-50 p-4 text-xs leading-relaxed text-gray-600">
            {PRIVACY_TEXT.split("\n").map((line, i) => (
              <p key={i} className={line === "" ? "h-3" : ""}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ===== 6. CONSENT ===== */}
        <div className="space-y-3 rounded-lg border border-border bg-gray-50 p-4">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
            />
            <span className="text-sm text-gray-600">
              <Link
                href="/privacy"
                className="font-medium text-primary-light no-underline hover:underline"
              >
                プライバシーポリシー
              </Link>
              および
              <Link
                href="/terms"
                className="font-medium text-primary-light no-underline hover:underline"
              >
                利用規約
              </Link>
              、個人情報の取り扱いについて同意する
            </span>
          </label>
          {errors.agree && (
            <p className="text-xs font-medium text-red-500">{errors.agree}</p>
          )}

          {!isLoggedIn && (
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={agreeRegister}
                onChange={(e) => setAgreeRegister(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-primary"
              />
              <span className="text-sm text-gray-600">
                資料請求と合わせて会員登録をする場合はチェックを入れてください
              </span>
            </label>
          )}
        </div>

        {/* ===== 7. SUBMIT ===== */}
        <button
          type="submit"
          disabled={!agreePrivacy}
          className="btn-danger w-full px-6 py-3.5 text-base font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          資料請求
        </button>

        {/* ===== 8. BOTTOM NOTE ===== */}
        <p className="text-center text-xs text-muted">
          ※資料請求と問合せをしたメールはマイページで確認できます。
        </p>
      </form>
    </div>
  );
}

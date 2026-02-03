"use client";

import { useState } from "react";
import {
  Settings,
  Mail,
  Lock,
  Database,
  Globe,
  Save,
  Monitor,
  Key,
  ChevronDown,
  ChevronUp,
  Upload,
  ImageIcon,
  CheckCircle,
  X,
} from "lucide-react";

/* ============================================
   Accordion Section
   ============================================ */

function Section({
  title,
  icon: Icon,
  tag,
  defaultOpen = true,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
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
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">{tag}</span>
          <Icon className="h-4.5 w-4.5 text-gray-400" />
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}
    </div>
  );
}

/* ============================================
   Toggle Switch
   ============================================ */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5.5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}

/* ============================================
   Field helpers
   ============================================ */

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-700">
      {children}
    </label>
  );
}

const inputCls = "w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";
const selectCls = "w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100";

/* ============================================
   Page Component
   ============================================ */

export default function AdminSettingsPage() {
  /* --- A: Site --- */
  const [siteName, setSiteName] = useState("NOI 収益不動産専門サイト");
  const [siteDescription, setSiteDescription] = useState("全国の一棟収益不動産ポータルサイト。区分マンション、一棟アパート、一棟マンションなどの収益物件を多数掲載。");
  const [companyName, setCompanyName] = useState("株式会社青山地所");
  const [contactEmail, setContactEmail] = useState("info@aoyama-chisho.co.jp");
  const [contactPhone, setContactPhone] = useState("03-0000-0000");
  const [businessHours, setBusinessHours] = useState("平日 9:00〜18:00（土日祝休み）");

  /* --- B: Display --- */
  const [perPage, setPerPage] = useState("20");
  const [defaultSort, setDefaultSort] = useState("newest");
  const [imageSizeLimit, setImageSizeLimit] = useState("5");

  /* --- C: Email --- */
  const [notifyEmail, setNotifyEmail] = useState("admin@aoyama-chisho.co.jp");
  const [notifyInquiry, setNotifyInquiry] = useState(true);
  const [notifyRegistration, setNotifyRegistration] = useState(true);
  const [notifyProperty, setNotifyProperty] = useState(false);

  /* --- D: SEO --- */
  const [seoTitle, setSeoTitle] = useState("NOI - 収益不動産専門ポータルサイト");
  const [seoDescription, setSeoDescription] = useState("全国の収益不動産・投資用物件を探すならNOI。区分マンション、一棟アパート、一棟マンションなど多数掲載。");
  const [seoKeywords, setSeoKeywords] = useState("収益不動産,投資用物件,一棟マンション,一棟アパート,区分マンション,不動産投資");
  const [ogpImage, setOgpImage] = useState<string | null>(null);

  /* --- E: API --- */
  const [googleMapsKey, setGoogleMapsKey] = useState("AIza****************************");
  const [supabaseUrl] = useState("https://xxxxxxxxxxxx.supabase.co");
  const [showApiKey, setShowApiKey] = useState(false);

  /* --- F: Security --- */
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [ipWhitelist, setIpWhitelist] = useState("203.0.113.0/24\n198.51.100.0/24");
  const [loginAttempts, setLoginAttempts] = useState("5");

  /* --- G: Backup --- */
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [lastBackup] = useState("2026/01/29 03:00");

  /* --- Toast --- */
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    console.log("Settings saved:", {
      site: { siteName, siteDescription, companyName, contactEmail, contactPhone, businessHours },
      display: { perPage, defaultSort, imageSizeLimit },
      email: { notifyEmail, notifyInquiry, notifyRegistration, notifyProperty },
      seo: { seoTitle, seoDescription, seoKeywords, ogpImage },
      api: { googleMapsKey },
      security: { twoFactor, sessionTimeout, ipWhitelist, loginAttempts },
      backup: { autoBackup, backupFrequency },
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBackupNow = () => {
    if (confirm("今すぐバックアップを実行しますか？")) {
      console.log("Manual backup triggered");
      alert("バックアップを開始しました");
    }
  };

  const handleOgpUpload = () => {
    setOgpImage("ogp_image.png");
  };

  return (
    <div className="pb-24">
      {/* Toast */}
      {showToast && (
        <div className="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-5 py-3 shadow-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">設定を保存しました</span>
          <button type="button" onClick={() => setShowToast(false)} className="ml-2 text-green-400 hover:text-green-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ===== 1. PAGE HEADER ===== */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">サイト全体の設定を管理します</p>
      </div>

      {/* ===== 2. SECTIONS ===== */}
      <div className="space-y-5">
        {/* ===== A: サイト設定 ===== */}
        <Section title="サイト設定" icon={Globe} tag="A">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="site-name">サイト名</Label>
              <input id="site-name" type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="site-desc">サイト説明</Label>
              <textarea id="site-desc" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} rows={3} className={inputCls} />
            </div>
            <div>
              <Label htmlFor="company-name">運営会社名</Label>
              <input id="company-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label htmlFor="contact-email">問い合わせメールアドレス</Label>
              <input id="contact-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label htmlFor="contact-phone">電話番号</Label>
              <input id="contact-phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputCls} />
            </div>
            <div>
              <Label htmlFor="business-hours">営業時間</Label>
              <input id="business-hours" type="text" value={businessHours} onChange={(e) => setBusinessHours(e.target.value)} className={inputCls} />
            </div>
          </div>
        </Section>

        {/* ===== B: 表示設定 ===== */}
        <Section title="表示設定" icon={Monitor} tag="B">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label htmlFor="per-page">1ページあたりの表示件数</Label>
              <select id="per-page" value={perPage} onChange={(e) => setPerPage(e.target.value)} className={selectCls}>
                <option value="10">10件</option>
                <option value="20">20件</option>
                <option value="50">50件</option>
                <option value="100">100件</option>
              </select>
            </div>
            <div>
              <Label htmlFor="default-sort">デフォルトソート</Label>
              <select id="default-sort" value={defaultSort} onChange={(e) => setDefaultSort(e.target.value)} className={selectCls}>
                <option value="newest">新着順</option>
                <option value="price-asc">価格（安い順）</option>
                <option value="price-desc">価格（高い順）</option>
                <option value="yield-desc">利回り（高い順）</option>
              </select>
            </div>
            <div>
              <Label htmlFor="image-limit">画像サイズ制限</Label>
              <div className="flex items-center gap-2">
                <input id="image-limit" type="number" value={imageSizeLimit} onChange={(e) => setImageSizeLimit(e.target.value)} className={inputCls} min={1} max={20} />
                <span className="shrink-0 text-sm font-medium text-gray-500">MB</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== C: メール設定 ===== */}
        <Section title="メール設定" icon={Mail} tag="C">
          <div className="space-y-5">
            <div>
              <Label htmlFor="notify-email">通知メールアドレス</Label>
              <input id="notify-email" type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className={inputCls} />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700">通知設定</p>
              <Toggle checked={notifyInquiry} onChange={setNotifyInquiry} label="問い合わせ受信通知" />
              <Toggle checked={notifyRegistration} onChange={setNotifyRegistration} label="会員登録通知" />
              <Toggle checked={notifyProperty} onChange={setNotifyProperty} label="物件登録通知" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => alert("メールテンプレート編集画面を表示（モック）")}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                メールテンプレート編集
              </button>
            </div>
          </div>
        </Section>

        {/* ===== D: SEO設定 ===== */}
        <Section title="SEO設定" icon={Globe} tag="D" defaultOpen={false}>
          <div className="space-y-5">
            <div>
              <Label htmlFor="seo-title">サイトタイトル</Label>
              <input id="seo-title" type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">{seoTitle.length}/60 文字</p>
            </div>
            <div>
              <Label htmlFor="seo-desc">メタディスクリプション</Label>
              <textarea id="seo-desc" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">{seoDescription.length}/160 文字</p>
            </div>
            <div>
              <Label htmlFor="seo-keywords">メタキーワード</Label>
              <input id="seo-keywords" type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} className={inputCls} />
              <p className="mt-1 text-xs text-gray-400">カンマ区切りで入力</p>
            </div>
            <div>
              <Label>OGP画像</Label>
              {ogpImage ? (
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <div className="flex h-12 w-20 items-center justify-center rounded bg-gray-200">
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <span className="flex-1 text-sm text-gray-600">{ogpImage}</span>
                  <button type="button" onClick={() => setOgpImage(null)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleOgpUpload}
                  className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-6 py-6 text-gray-400 transition-colors hover:border-blue-400 hover:text-blue-500"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-sm font-medium">OGP画像をアップロード</span>
                  <span className="text-xs">推奨サイズ: 1200×630px（JPG, PNG）</span>
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* ===== E: API設定 ===== */}
        <Section title="API設定" icon={Key} tag="E" defaultOpen={false}>
          <div className="space-y-5">
            <div>
              <Label htmlFor="gmap-key">Google Maps API Key</Label>
              <div className="flex items-center gap-2">
                <input
                  id="gmap-key"
                  type={showApiKey ? "text" : "password"}
                  value={googleMapsKey}
                  onChange={(e) => setGoogleMapsKey(e.target.value)}
                  className={inputCls}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                >
                  {showApiKey ? "非表示" : "表示"}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="supabase-url">Supabase URL</Label>
              <input id="supabase-url" type="text" value={supabaseUrl} readOnly className={`${inputCls} cursor-not-allowed bg-gray-50 text-gray-500`} />
              <p className="mt-1 text-xs text-gray-400">読み取り専用</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-700">
                外部サービス連携の追加・変更は、システム管理者にお問い合わせください。
              </p>
            </div>
          </div>
        </Section>

        {/* ===== F: セキュリティ設定 ===== */}
        <Section title="セキュリティ設定" icon={Lock} tag="F" defaultOpen={false}>
          <div className="space-y-5">
            <Toggle checked={twoFactor} onChange={setTwoFactor} label="2段階認証" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="session-timeout">セッションタイムアウト</Label>
                <select id="session-timeout" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className={selectCls}>
                  <option value="30">30分</option>
                  <option value="60">1時間</option>
                  <option value="120">2時間</option>
                  <option value="480">8時間</option>
                </select>
              </div>
              <div>
                <Label htmlFor="login-attempts">ログイン試行回数制限</Label>
                <div className="flex items-center gap-2">
                  <input id="login-attempts" type="number" value={loginAttempts} onChange={(e) => setLoginAttempts(e.target.value)} className={inputCls} min={1} max={20} />
                  <span className="shrink-0 text-sm font-medium text-gray-500">回</span>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="ip-whitelist">IPアドレス制限</Label>
              <textarea
                id="ip-whitelist"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                rows={4}
                className={`${inputCls} font-mono text-xs`}
                placeholder="許可するIPアドレスを1行ずつ入力"
              />
              <p className="mt-1 text-xs text-gray-400">CIDR表記対応（例: 203.0.113.0/24）。空欄で制限なし。</p>
            </div>
          </div>
        </Section>

        {/* ===== G: バックアップ設定 ===== */}
        <Section title="バックアップ設定" icon={Database} tag="G" defaultOpen={false}>
          <div className="space-y-5">
            <Toggle checked={autoBackup} onChange={setAutoBackup} label="自動バックアップ" />
            {autoBackup && (
              <div>
                <Label htmlFor="backup-freq">バックアップ頻度</Label>
                <select id="backup-freq" value={backupFrequency} onChange={(e) => setBackupFrequency(e.target.value)} className={selectCls}>
                  <option value="daily">毎日</option>
                  <option value="weekly">毎週</option>
                  <option value="monthly">毎月</option>
                </select>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-700">最終バックアップ</p>
                <p className="mt-0.5 text-xs text-gray-500">{lastBackup}</p>
              </div>
              <button
                type="button"
                onClick={handleBackupNow}
                className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                <Database className="h-4 w-4" />
                今すぐ実行
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* ===== 3. STICKY SAVE BAR ===== */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white px-6 py-3 shadow-lg lg:left-64">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}

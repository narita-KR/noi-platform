"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  Send,
  Trash2,
  CheckCircle,
  AlertCircle,
  MapPin,
  ChevronRight,
  UserIcon,
  Building,
  FileText,
  Plus,
  Forward,
  Save,
  Copy,
} from "lucide-react";

/* ============================================
   Mock Data
   ============================================ */

function getMockInquiry(id: string) {
  return {
    id,
    receivedAt: "2026/01/29 14:00",
    type: "資料請求" as const,
    status: "対応中" as const,
    property: {
      id: 1234,
      title: "東京都港区 区分マンション",
      price: "5,800万円",
      yield: "6.2%",
      location: "東京都港区赤坂1-2-3",
      category: "区分マンション",
    },
    user: {
      id: 1001,
      name: "田中 太郎",
      email: "tanaka.taro@example.com",
      phone: "090-1234-5678",
      totalInquiries: 3,
    },
    seller: {
      id: 2001,
      name: "山田不動産",
      contactName: "山田 一郎",
      phone: "03-1234-5678",
      email: "info@yamada-re.co.jp",
    },
    message: `はじめまして。田中と申します。

こちらの物件について詳しい資料をいただけますでしょうか。
特に以下の点について知りたいと考えております。

・現在の入居状況
・修繕履歴
・管理組合の積立金の状況
・近隣の開発計画

融資を利用しての購入を検討しております。
ご対応よろしくお願いいたします。`,
    timeline: [
      { date: "2026/01/29 15:30", actor: "管理者（佐藤）", action: "ステータスを「対応中」に変更", type: "status" },
      { date: "2026/01/29 15:25", actor: "管理者（佐藤）", action: "内部メモを追加：「融資利用検討中。資料送付準備開始。」", type: "note" },
      { date: "2026/01/29 14:05", actor: "System", action: "山田不動産に自動転送メールを送信", type: "system" },
      { date: "2026/01/29 14:00", actor: "System", action: "問い合わせ受信", type: "system" },
    ],
    adminNotes: "融資利用検討中。資料送付準備開始。年収800万円〜1,000万円の有料会員。過去2回問い合わせあり（いずれも区分マンション）。",
  };
}

const EMAIL_TEMPLATES = [
  { id: "thanks", label: "受信確認", body: "お問い合わせいただきありがとうございます。内容を確認の上、担当者より折り返しご連絡させていただきます。" },
  { id: "docs", label: "資料送付", body: "お問い合わせの物件資料を添付にてお送りいたします。ご不明な点がございましたら、お気軽にご連絡ください。" },
  { id: "viewing", label: "内見日程調整", body: "内見のご希望をいただきありがとうございます。ご都合の良い日時を3つほどお知らせいただけますでしょうか。" },
  { id: "followup", label: "フォローアップ", body: "先日お送りした資料はご確認いただけましたでしょうか。ご質問等ございましたら、お気軽にお問い合わせください。" },
];

const STATUSES: ("未対応" | "対応中" | "完了")[] = ["未対応", "対応中", "完了"];

/* ============================================
   Helpers
   ============================================ */

function statusBadgeCls(status: string) {
  switch (status) {
    case "未対応": return "bg-red-100 text-red-700";
    case "対応中": return "bg-yellow-100 text-yellow-700";
    case "完了": return "bg-green-100 text-green-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

function statusIconEl(status: string) {
  switch (status) {
    case "未対応": return <AlertCircle className="h-3.5 w-3.5" />;
    case "対応中": return <Clock className="h-3.5 w-3.5" />;
    case "完了": return <CheckCircle className="h-3.5 w-3.5" />;
    default: return null;
  }
}

function typeBadgeCls(type: string) {
  switch (type) {
    case "資料請求": return "bg-blue-100 text-blue-700";
    case "内見希望": return "bg-purple-100 text-purple-700";
    case "融資相談": return "bg-orange-100 text-orange-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

function timelineIconCls(type: string) {
  switch (type) {
    case "status": return { bg: "bg-yellow-100", color: "text-yellow-600" };
    case "note": return { bg: "bg-blue-100", color: "text-blue-600" };
    case "email": return { bg: "bg-green-100", color: "text-green-600" };
    case "system": return { bg: "bg-gray-100", color: "text-gray-500" };
    default: return { bg: "bg-gray-100", color: "text-gray-500" };
  }
}

function timelineIcon(type: string) {
  switch (type) {
    case "status": return <Clock className="h-3.5 w-3.5" />;
    case "note": return <FileText className="h-3.5 w-3.5" />;
    case "email": return <Mail className="h-3.5 w-3.5" />;
    case "system": return <CheckCircle className="h-3.5 w-3.5" />;
    default: return <Clock className="h-3.5 w-3.5" />;
  }
}

/* ============================================
   Page Component
   ============================================ */

export default function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const inquiry = getMockInquiry(id);

  const [status, setStatus] = useState(inquiry.status);
  const [adminNotes, setAdminNotes] = useState(inquiry.adminNotes);
  const [newNote, setNewNote] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [timeline, setTimeline] = useState(inquiry.timeline);

  const handleStatusChange = (newStatus: string) => {
    const prev = status;
    setStatus(newStatus as typeof status);
    setTimeline((t) => [
      { date: new Date().toLocaleString("ja-JP"), actor: "管理者", action: `ステータスを「${newStatus}」に変更`, type: "status" },
      ...t,
    ]);
    console.log("Status changed:", prev, "→", newStatus);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setTimeline((t) => [
      { date: new Date().toLocaleString("ja-JP"), actor: "管理者", action: `内部メモを追加：「${newNote}」`, type: "note" },
      ...t,
    ]);
    setAdminNotes((prev) => prev + "\n" + newNote);
    setNewNote("");
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) setEmailBody(tpl.body);
    else setEmailBody("");
  };

  const handleSendEmail = () => {
    if (!emailBody.trim()) { alert("メール本文を入力してください"); return; }
    if (confirm(`${inquiry.user.name} にメールを送信しますか？`)) {
      setTimeline((t) => [
        { date: new Date().toLocaleString("ja-JP"), actor: "管理者", action: `ユーザーにメール送信`, type: "email" },
        ...t,
      ]);
      setEmailBody("");
      setSelectedTemplate("");
      console.log("Email sent to:", inquiry.user.email);
    }
  };

  const handleForwardToSeller = () => {
    if (confirm(`${inquiry.seller.name} に問い合わせを転送しますか？`)) {
      setTimeline((t) => [
        { date: new Date().toLocaleString("ja-JP"), actor: "管理者", action: `${inquiry.seller.name}に転送`, type: "email" },
        ...t,
      ]);
      console.log("Forwarded to seller:", inquiry.seller.email);
    }
  };

  const handleMarkComplete = () => {
    if (confirm("この問い合わせを「完了」としてマークしますか？")) {
      handleStatusChange("完了");
    }
  };

  const handleDelete = () => {
    if (confirm(`問い合わせ #${id} を削除しますか？\n\nこの操作は取り消せません。`)) {
      console.log("Delete inquiry:", id);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== 1. PAGE HEADER ===== */}
      <div className="space-y-3">
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/admin" className="text-gray-500 no-underline hover:text-blue-600">ダッシュボード</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/admin/inquiries" className="text-gray-500 no-underline hover:text-blue-600">問い合わせ管理</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700">#{id}</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/inquiries" className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">問い合わせ詳細 #{id}</h1>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeCls(status)}`}>
              {statusIconEl(status)}
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              削除
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ===== LEFT COLUMN (2/3) ===== */}
        <div className="space-y-6 lg:col-span-2">
          {/* ===== 2. INQUIRY INFO ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-sm font-bold text-gray-900">問い合わせ情報</h2>
            </div>
            <div className="p-5">
              {/* Property card */}
              <div className="mb-5 flex gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded bg-gray-200 text-xs text-gray-400">
                  物件画像
                </div>
                <div className="min-w-0 flex-1">
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                    {inquiry.property.category}
                  </span>
                  <p className="mt-0.5 truncate text-sm font-medium text-gray-800">{inquiry.property.title}</p>
                  <p className="text-sm font-bold text-red-600">
                    {inquiry.property.price}
                    <span className="ml-1.5 text-xs font-medium text-gray-500">利回り {inquiry.property.yield}</span>
                  </p>
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {inquiry.property.location}
                  </p>
                </div>
                <Link
                  href={`/properties/${inquiry.property.id}`}
                  target="_blank"
                  className="mt-auto shrink-0 rounded-md bg-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 no-underline transition-colors hover:bg-gray-300"
                >
                  物件詳細
                </Link>
              </div>

              {/* Details grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-gray-400">受信日時</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {inquiry.receivedAt}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">種類</p>
                  <p className="mt-1">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeBadgeCls(inquiry.type)}`}>
                      {inquiry.type}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">ステータス</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeCls(status)}`}>
                      {statusIconEl(status)}
                      {status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">担当業者</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-gray-800">
                    <Building className="h-4 w-4 text-gray-400" />
                    <Link href={`/admin/publishers/${inquiry.seller.id}`} className="text-blue-600 no-underline hover:underline">
                      {inquiry.seller.name}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== 4. INQUIRY MESSAGE ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">問い合わせ内容</h2>
            </div>
            <div className="p-5">
              <div className="whitespace-pre-wrap rounded-lg border border-gray-100 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                {inquiry.message}
              </div>
            </div>
          </div>

          {/* ===== 6. QUICK ACTIONS — EMAIL ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Mail className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">メール返信</h2>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">テンプレート選択</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">テンプレートを選択...</option>
                  {EMAIL_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  宛先: {inquiry.user.email}
                </label>
                <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="メール本文を入力..."
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSendEmail}
                  className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  ユーザーにメール送信
                </button>
                <button
                  type="button"
                  onClick={handleForwardToSeller}
                  className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Forward className="h-4 w-4" />
                  業者に転送
                </button>
                {status !== "完了" && (
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    className="inline-flex items-center gap-1.5 rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    完了としてマーク
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ===== 5. ADMIN NOTES ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <FileText className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">内部メモ</h2>
            </div>
            <div className="space-y-4 p-5">
              <div className="whitespace-pre-wrap rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-gray-700">
                {adminNotes}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="メモを追加..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(); }}
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                  className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  追加
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN (1/3) ===== */}
        <div className="space-y-6">
          {/* ===== 3. USER INFO ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">問い合わせ者</h2>
            </div>
            <div className="p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{inquiry.user.name}</p>
                  <Link href={`/admin/members/${inquiry.user.id}`} className="text-xs text-blue-600 no-underline hover:underline">
                    ユーザー詳細を表示
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <a href={`mailto:${inquiry.user.email}`} className="text-blue-600 no-underline hover:underline">
                    {inquiry.user.email}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-700">
                  <Phone className="h-4 w-4 shrink-0 text-gray-400" />
                  {inquiry.user.phone}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-blue-50 px-3 py-2.5">
                <p className="text-xs font-medium text-blue-700">
                  この方からの問い合わせ: {inquiry.user.totalInquiries}件目
                </p>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => alert(`${inquiry.user.email} にメールを送信（モック）`)}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Mail className="h-4 w-4" />
                  メール送信
                </button>
              </div>
            </div>
          </div>

          {/* ===== SELLER INFO ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Building className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">担当業者</h2>
            </div>
            <div className="p-5">
              <p className="font-medium text-gray-800">{inquiry.seller.name}</p>
              <p className="text-xs text-gray-500">担当: {inquiry.seller.contactName}</p>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  {inquiry.seller.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {inquiry.seller.email}
                </div>
              </div>

              <div className="mt-4">
                <Link
                  href={`/admin/publishers/${inquiry.seller.id}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-50"
                >
                  <Building className="h-4 w-4" />
                  業者詳細
                </Link>
              </div>
            </div>
          </div>

          {/* ===== TIMELINE ===== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
              <Clock className="h-4 w-4 text-gray-400" />
              <h2 className="text-sm font-bold text-gray-900">対応履歴</h2>
            </div>
            <div className="p-5">
              <div className="space-y-0">
                {timeline.map((entry, i) => {
                  const ic = timelineIconCls(entry.type);
                  return (
                    <div key={i} className="relative flex gap-3 pb-5 last:pb-0">
                      {i < timeline.length - 1 && (
                        <div className="absolute left-[15px] top-8 h-[calc(100%-20px)] w-px bg-gray-200" />
                      )}
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ic.bg}`}>
                        <span className={ic.color}>{timelineIcon(entry.type)}</span>
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <p className="text-xs font-medium text-gray-800">{entry.action}</p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {entry.actor} · {entry.date}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

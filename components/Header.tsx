"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const navLinks = [
  { label: "新着", href: "/search?sort=new" },
  { label: "利回り高", href: "/search?sort=yield-high" },
  { label: "価格安", href: "/search?sort=price-low" },
  { label: "価格高", href: "/search?sort=price-high" },
  { label: "駅近", href: "/search?sort=station-close" },
  { label: "築浅", href: "/search?sort=year-new" },
  { label: "高積算", href: "/search?sort=assessed-high" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* ========== ROW 1: Navy Bar ========== */}
      <div className="bg-blue-900">
        <div className="mx-auto flex h-16 max-w-350 items-center justify-between px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 no-underline"
          >
            <span className="text-2xl font-bold text-white">NOI</span>
            <span className="hidden text-xs leading-tight text-white/80 sm:block">
              収益不動産
              <br />
              専門サイト
            </span>
          </Link>

          {/* Center Navigation (desktop) */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm text-white no-underline hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Auth Buttons (desktop) + Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="rounded border border-white px-6 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-white hover:text-blue-900"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="rounded bg-red-600 px-6 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-red-700"
              >
                無料会員登録
              </Link>
              <Link
                href="/register?type=seller"
                className="rounded bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 no-underline transition hover:bg-yellow-500"
              >
                掲載者会員登録
              </Link>
            </div>

            {/* Hamburger (mobile) */}
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded text-white hover:bg-white/10 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========== ROW 2: Search Bar (ONLY ONE) ========== */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-350 px-4 py-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="東京都 区分マンション"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">検索</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========== ROW 3: Quick Filter Pills ========== */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-350 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full bg-blue-900 px-6 py-2 text-sm text-white no-underline transition hover:bg-blue-800"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ========== Mobile Menu ========== */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-blue-900 md:hidden">
          <div className="mx-auto max-w-350 space-y-4 px-4 py-5">
            {/* Nav links */}
            <div className="flex flex-wrap gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded bg-white/10 px-6 py-2 text-sm font-semibold text-white no-underline transition hover:bg-white/20"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <hr className="border-white/15" />

            {/* Auth buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded border border-white px-6 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-white hover:text-blue-900"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded bg-red-600 px-6 py-2.5 text-sm font-bold text-white no-underline transition hover:bg-red-700"
              >
                無料会員登録
              </Link>
              <Link
                href="/register?type=seller"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded bg-yellow-400 px-6 py-2.5 text-sm font-bold text-gray-900 no-underline transition hover:bg-yellow-500"
              >
                掲載者会員登録
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

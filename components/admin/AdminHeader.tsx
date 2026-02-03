"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-700 bg-[#1e293b] px-4">
      {/* Left: hamburger + logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white lg:hidden"
          aria-label="メニュー"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-lg font-bold tracking-tight text-white">
          NOI <span className="text-sm font-medium text-slate-400">Admin</span>
        </span>
      </div>

      {/* Right: user menu */}
      <div className="flex items-center gap-4 text-sm">
        <span className="hidden text-slate-300 sm:inline">
          ようこそ <span className="font-medium text-white">管理者様</span>
        </span>
        <button
          type="button"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
        >
          ログアウト
        </button>
      </div>
    </header>
  );
}

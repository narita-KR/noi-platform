"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building,
  Users,
  Store,
  Mail,
  Settings,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/properties", label: "物件管理", icon: Building },
  { href: "/admin/members", label: "会員管理", icon: Users },
  { href: "/admin/publishers", label: "掲載者管理", icon: Store },
  { href: "/admin/inquiries", label: "問合せ管理", icon: Mail },
  { href: "/admin/settings", label: "設定", icon: Settings },
];

export default function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0f172a] transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4 lg:hidden">
          <span className="text-lg font-bold text-white">
            NOI <span className="text-sm font-medium text-slate-400">Admin</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop logo */}
        <div className="hidden h-14 items-center border-b border-slate-800 px-5 lg:flex">
          <span className="text-lg font-bold text-white">
            NOI <span className="text-sm font-medium text-slate-400">Admin</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom info */}
        <div className="border-t border-slate-800 px-4 py-3">
          <p className="text-xs text-slate-500">© 青山地所 管理システム</p>
        </div>
      </aside>
    </>
  );
}

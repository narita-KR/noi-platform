import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { label: "会社情報", href: "/company" },
  { label: "特商法", href: "/tokushoho" },
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用規約", href: "/terms" },
  { label: "お問い合わせ", href: "/inquiry" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white">
      <div className="mx-auto max-w-350 space-y-6 px-4 py-8">
        {/* Company Info */}
        <div className="text-center">
          <p className="text-lg font-bold tracking-wide text-white">
            株式会社青山地所
          </p>
          <p className="mt-1 text-sm text-gray-300">
            東京都港区赤坂
          </p>
          <p className="mt-1 text-xs text-gray-400">
            宅建免許番号 東京都知事（1）第103128号
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-600" />

        {/* Links */}
        <nav aria-label="フッターナビゲーション">
          <ul className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center">
            {footerLinks.map((link, i) => (
              <li key={link.href} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="text-sm text-gray-300 no-underline transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
                {i < footerLinks.length - 1 && (
                  <span
                    className="hidden text-gray-500 sm:inline"
                    aria-hidden="true"
                  >
                    |
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-center text-xs text-gray-400">
          &copy; 2025 Aoyama Real Estate Co., Ltd. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

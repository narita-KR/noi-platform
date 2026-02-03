import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOI - 収益不動産専門サイト | 全国の一棟収益不動産ポータルサイト",
  description:
    "収益不動産の売買仲介なら株式会社青山地所。一棟マンション・アパートの投資物件を掲載。",
  keywords: "収益不動産,投資物件,一棟マンション,一棟アパート",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}

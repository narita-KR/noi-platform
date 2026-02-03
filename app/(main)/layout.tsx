import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-350">
      <Header />
      <main className="min-h-screen bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}

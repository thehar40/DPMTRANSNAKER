import { Topbar } from "@/components/layout/topbar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { getSettings } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Topbar />
      <Navbar />
      <main className="site-main flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
    </div>
  );
}

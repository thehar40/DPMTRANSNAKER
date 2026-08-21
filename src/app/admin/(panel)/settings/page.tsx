import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Pengaturan Website</h2>
        <p className="text-sm text-slate-500">
          Kelola nama dinas, alamat, kontak, media sosial, dan jam layanan.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}

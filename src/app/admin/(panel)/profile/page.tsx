import type { Metadata } from "next";
import { ProfileForm } from "@/components/admin/forms/profile-form";
import { getProfile } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Dinas",
};

const FALLBACK = {
  welcomeTitle: "Sambutan Kepala Dinas",
  welcomeName: null,
  welcomePosition: null,
  welcomeText: "",
  vision: "",
  mission: "",
  dutiesFunctions: "",
  serviceValues: "",
};

export default async function AdminProfilePage() {
  const profile = (await getProfile()) ?? FALLBACK;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Profil Dinas</h2>
        <p className="text-sm text-slate-500">
          Kelola sambutan kepala dinas, visi misi, tupoksi, dan nilai pelayanan
          yang tampil pada halaman Profil.
        </p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}

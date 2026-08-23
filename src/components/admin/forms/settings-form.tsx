"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/settings";
import {
  FieldError,
  Input,
  Label,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { settingSchema } from "@/lib/validation";

interface SettingsFormProps {
  initial: {
    agencyName: string;
    shortName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    mapEmbedUrl: string | null;
    officeHours: string;
  };
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    agencyName: initial.agencyName,
    shortName: initial.shortName,
    tagline: initial.tagline,
    address: initial.address,
    phone: initial.phone,
    email: initial.email,
    whatsapp: initial.whatsapp,
    facebook: initial.facebook ?? "",
    instagram: initial.instagram ?? "",
    youtube: initial.youtube ?? "",
    mapEmbedUrl: initial.mapEmbedUrl ?? "",
    officeHours: initial.officeHours,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = settingSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.errors) {
        const key = String(issue.path[0] ?? "");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Mohon periksa kembali isian formulir.");
      return;
    }
    setLoading(true);
    const fd = new FormData();
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = await updateSettings(fd);
    setLoading(false);
    if (result.ok) {
      toast.success("Pengaturan berhasil disimpan.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Informasi Dinas</h2>
        <p className="text-sm text-slate-500">
          Data ini ditampilkan di seluruh halaman website.
        </p>
      </div>

      <div>
        <Label htmlFor="agencyName" required>
          Nama Dinas
        </Label>
        <Input
          id="agencyName"
          value={form.agencyName}
          onChange={(e) => set("agencyName", e.target.value)}
        />
        <FieldError>{errors.agencyName}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="shortName" required>
            Singkatan
          </Label>
          <Input
            id="shortName"
            value={form.shortName}
            onChange={(e) => set("shortName", e.target.value)}
          />
          <FieldError>{errors.shortName}</FieldError>
        </div>
        <div>
          <Label htmlFor="tagline" required>
            Tagline
          </Label>
          <Input
            id="tagline"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
          <FieldError>{errors.tagline}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="address" required>
          Alamat
        </Label>
        <Textarea
          id="address"
          rows={2}
          value={form.address}
          onChange={(e) => set("address", e.target.value)}
        />
        <FieldError>{errors.address}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="phone">Telepon</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            placeholder="Contoh: 081234567890"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="facebook">Facebook</Label>
          <Input
            id="facebook"
            value={form.facebook}
            onChange={(e) => set("facebook", e.target.value)}
            placeholder="https://facebook.com/..."
          />
        </div>
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={form.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            placeholder="https://instagram.com/..."
          />
        </div>
        <div>
          <Label htmlFor="youtube">YouTube</Label>
          <Input
            id="youtube"
            value={form.youtube}
            onChange={(e) => set("youtube", e.target.value)}
            placeholder="https://youtube.com/@..."
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="officeHours" required>
            Jam Layanan
          </Label>
          <Input
            id="officeHours"
            value={form.officeHours}
            onChange={(e) => set("officeHours", e.target.value)}
          />
          <FieldError>{errors.officeHours}</FieldError>
        </div>
        <div>
          <Label htmlFor="mapEmbedUrl" hint="Gunakan URL Embed, bukan maps.app.goo.gl">
            Peta (Embed URL)
          </Label>
          <Input
            id="mapEmbedUrl"
            value={form.mapEmbedUrl}
            onChange={(e) => set("mapEmbedUrl", e.target.value)}
            placeholder="https://www.google.com/maps/embed?..."
          />
          <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
            Google Maps: pilih Bagikan &rarr; Sematkan peta &rarr; salin URL
            pada atribut <code className="rounded bg-slate-100 px-1">src</code>.
            Link pendek <code className="rounded bg-slate-100 px-1">maps.app.goo.gl</code> hanya dipakai untuk tombol buka lokasi.
          </p>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          Simpan Pengaturan
        </SubmitButton>
      </div>
    </form>
  );
}

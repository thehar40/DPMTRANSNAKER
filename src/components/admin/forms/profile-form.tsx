"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, UploadCloud, X } from "lucide-react";
import { updateProfile } from "@/lib/actions/profile";
import {
  FieldError,
  Input,
  Label,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { profileSchema } from "@/lib/validation";
import { uploadPublicFile } from "@/lib/upload-client";
import { SmartImage } from "@/components/ui/smart-image";

interface ProfileFormProps {
  initial: {
    welcomeTitle: string;
    welcomeName: string | null;
    welcomePosition: string | null;
    welcomePhoto: string | null;
    welcomeText: string;
    vision: string;
    mission: string;
    dutiesFunctions: string;
    serviceValues: string;
  };
}

export function ProfileForm({ initial }: ProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    welcomeTitle: initial.welcomeTitle,
    welcomeName: initial.welcomeName ?? "",
    welcomePosition: initial.welcomePosition ?? "",
    welcomePhoto: initial.welcomePhoto ?? "",
    welcomeText: initial.welcomeText,
    vision: initial.vision,
    mission: initial.mission,
    dutiesFunctions: initial.dutiesFunctions,
    serviceValues: initial.serviceValues,
  });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function uploadPhoto(file: File): Promise<string | null> {
    try {
      return await uploadPublicFile(file, "image");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Foto gagal diunggah."
      );
      return null;
    }
  }

  async function handlePhotoUpload() {
    if (!selectedPhotoFile) return;
    setPhotoUploading(true);
    const url = await uploadPhoto(selectedPhotoFile);
    setPhotoUploading(false);
    if (url) {
      set("welcomePhoto", url);
      setSelectedPhotoFile(null);
      toast.success("Foto kepala dinas berhasil diunggah.");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = profileSchema.safeParse(form);
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
    let welcomePhoto = form.welcomePhoto;
    if (selectedPhotoFile) {
      const uploaded = await uploadPhoto(selectedPhotoFile);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      welcomePhoto = uploaded;
    }
    const fd = new FormData();
    for (const [key, value] of Object.entries({ ...parsed.data, welcomePhoto })) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = await updateProfile(fd);
    setLoading(false);
    if (result.ok) {
      toast.success("Profil dinas berhasil disimpan.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Halaman Profil</h2>
        <p className="text-sm text-slate-500">
          Konten sambutan, visi misi, tupoksi, dan nilai pelayanan. Mendukung
          format Markdown.
        </p>
      </div>

      <div>
        <Label htmlFor="welcomeTitle" required>
          Judul Sambutan
        </Label>
        <Input
          id="welcomeTitle"
          value={form.welcomeTitle}
          onChange={(e) => set("welcomeTitle", e.target.value)}
        />
        <FieldError>{errors.welcomeTitle}</FieldError>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-wrap items-center gap-4">
          <SmartImage
            src={form.welcomePhoto}
            alt="Foto kepala dinas"
            className="h-24 w-24 shrink-0 rounded-full ring-2 ring-primary-200"
            imgClassName="rounded-full object-cover"
            iconClassName="h-8 w-8"
          />
          <div className="min-w-0 flex-1">
            <Label htmlFor="welcomePhotoFile">Foto Kepala Dinas</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="welcomePhotoFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setSelectedPhotoFile(e.target.files?.[0] ?? null)}
                className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
              />
              <button
                type="button"
                onClick={handlePhotoUpload}
                disabled={!selectedPhotoFile || photoUploading || loading}
                className="btn-secondary whitespace-nowrap"
              >
                <UploadCloud className="h-4 w-4" />
                {photoUploading ? "Mengunggah..." : "Unggah Foto"}
              </button>
            </div>
            {selectedPhotoFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-primary-700">
                <span className="truncate">{selectedPhotoFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPhotoFile(null)}
                  className="rounded p-0.5 hover:bg-primary-100"
                  aria-label="Hapus pilihan foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4 border-t border-slate-200 pt-4">
          <Label htmlFor="welcomePhoto" hint="Atau masukkan URL foto">
            URL Foto
          </Label>
          <Input
            id="welcomePhoto"
            value={form.welcomePhoto}
            onChange={(e) => set("welcomePhoto", e.target.value)}
            placeholder="https://... atau /uploads/news/foto.jpg"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="welcomeName">Nama Kepala Dinas</Label>
          <Input
            id="welcomeName"
            value={form.welcomeName}
            onChange={(e) => set("welcomeName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="welcomePosition">Jabatan</Label>
          <Input
            id="welcomePosition"
            value={form.welcomePosition}
            onChange={(e) => set("welcomePosition", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="welcomeText" required>
          Isi Sambutan
        </Label>
        <Textarea
          id="welcomeText"
          rows={8}
          value={form.welcomeText}
          onChange={(e) => set("welcomeText", e.target.value)}
        />
        <FieldError>{errors.welcomeText}</FieldError>
      </div>

      <div>
        <Label htmlFor="vision" required>
          Visi
        </Label>
        <Textarea
          id="vision"
          rows={3}
          value={form.vision}
          onChange={(e) => set("vision", e.target.value)}
        />
        <FieldError>{errors.vision}</FieldError>
      </div>

      <div>
        <Label htmlFor="mission" required hint="Satu baris per misi, awali dengan -">
          Misi
        </Label>
        <Textarea
          id="mission"
          rows={6}
          value={form.mission}
          onChange={(e) => set("mission", e.target.value)}
        />
        <FieldError>{errors.mission}</FieldError>
      </div>

      <div>
        <Label htmlFor="dutiesFunctions" required hint="Satu baris per poin, awali dengan -">
          Tugas Pokok dan Fungsi
        </Label>
        <Textarea
          id="dutiesFunctions"
          rows={6}
          value={form.dutiesFunctions}
          onChange={(e) => set("dutiesFunctions", e.target.value)}
        />
        <FieldError>{errors.dutiesFunctions}</FieldError>
      </div>

      <div>
        <Label htmlFor="serviceValues" required hint="Format: Nilai: Deskripsi">
          Nilai Pelayanan
        </Label>
        <Textarea
          id="serviceValues"
          rows={5}
          value={form.serviceValues}
          onChange={(e) => set("serviceValues", e.target.value)}
        />
        <FieldError>{errors.serviceValues}</FieldError>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          Simpan Profil
        </SubmitButton>
      </div>
    </form>
  );
}

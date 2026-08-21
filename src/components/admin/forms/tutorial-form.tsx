"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, UploadCloud, X } from "lucide-react";
import { createTutorial, updateTutorial } from "@/lib/actions/tutorials";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { tutorialSchema } from "@/lib/validation";
import { slugify, toDateTimeLocalValue } from "@/lib/utils";

interface TutorialFormProps {
  tutorial?: {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    content: string | null;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    duration: string | null;
    order: number;
    status: string;
    publishedAt: Date | null;
  } | null;
}

export function TutorialForm({ tutorial }: TutorialFormProps) {
  const router = useRouter();
  const isEdit = !!tutorial;
  const [form, setForm] = useState({
    title: tutorial?.title ?? "",
    slug: tutorial?.slug ?? "",
    category: tutorial?.category ?? "Perizinan",
    description: tutorial?.description ?? "",
    content: tutorial?.content ?? "",
    videoUrl: tutorial?.videoUrl ?? "",
    thumbnailUrl: tutorial?.thumbnailUrl ?? "",
    duration: tutorial?.duration ?? "",
    order: String(tutorial?.order ?? 0),
    status: tutorial?.status ?? "draft",
    publishedAt: toDateTimeLocalValue(tutorial?.publishedAt),
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleTitle = (value: string) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
    setErrors((current) => ({ ...current, title: "" }));
  };

  async function uploadSelectedFile(file: File): Promise<string | null> {
    const uploadData = new FormData();
    uploadData.set("file", file);
    const response = await fetch("/api/admin/tutorials/upload", {
      method: "POST",
      body: uploadData,
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.url) {
      toast.error(body.error ?? "Video gagal diunggah.");
      return null;
    }
    return String(body.url);
  }

  async function handleUploadClick() {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const url = await uploadSelectedFile(selectedFile);
      if (url) {
        set("videoUrl", url);
        setSelectedFile(null);
        toast.success("Video berhasil diunggah. Jangan lupa simpan tutorial.");
      }
    } catch {
      toast.error("Video gagal diunggah. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = tutorialSchema.safeParse(form);
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
    try {
      let videoUrl = form.videoUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadSelectedFile(selectedFile);
        if (!uploadedUrl) return;
        videoUrl = uploadedUrl;
      }

      const fd = new FormData();
      if (tutorial) fd.set("id", String(tutorial.id));
      const payload = { ...parsed.data, videoUrl };
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null) continue;
        if (value instanceof Date) fd.set(key, value.toISOString());
        else fd.set(key, String(value));
      }

      const result = isEdit ? await updateTutorial(fd) : await createTutorial(fd);
      if (result.ok) {
        toast.success(
          isEdit ? "Tutorial berhasil diperbarui." : "Tutorial berhasil ditambahkan."
        );
        router.push("/admin/tutorials");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Tutorial gagal disimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div>
        <Label htmlFor="title" required>
          Judul Tutorial
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleTitle(e.target.value)}
          placeholder="Contoh: Tutorial Perizinan OSS"
        />
        <FieldError>{errors.title}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug" required hint="URL unik">
            Slug
          </Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", slugify(e.target.value));
            }}
          />
          <FieldError>{errors.slug}</FieldError>
        </div>
        <div>
          <Label htmlFor="category" required>
            Kategori
          </Label>
          <Input
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Perizinan / Penanaman Modal"
          />
          <FieldError>{errors.category}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="description" required>
          Deskripsi Singkat
        </Label>
        <Textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Jelaskan isi tutorial secara singkat."
        />
        <FieldError>{errors.description}</FieldError>
      </div>

      <div className="rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Video Tutorial</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Pilih file video maksimal 100 MB, atau masukkan URL YouTube,
              Vimeo, atau MP4. File upload lokal tersimpan di
              <code className="ml-1 rounded bg-white px-1 py-0.5 text-primary-700">public/uploads/tutorials</code>.
            </p>
          </div>
          <UploadCloud className="h-5 w-5 shrink-0 text-primary-600" />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Label htmlFor="videoFile">Upload File Video</Label>
            <Input
              id="videoFile"
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
            />
            {selectedFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-primary-700">
                <span className="truncate">{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded p-0.5 hover:bg-primary-100"
                  aria-label="Hapus pilihan file"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={!selectedFile || uploading || loading}
            className="btn-secondary whitespace-nowrap"
          >
            <UploadCloud className="h-4 w-4" />
            {uploading ? "Mengunggah..." : "Unggah Sekarang"}
          </button>
        </div>

        <div className="mt-4">
          <Label htmlFor="videoUrl" hint="Diisi otomatis setelah upload">
            URL Video
          </Label>
          <Input
            id="videoUrl"
            value={form.videoUrl}
            onChange={(e) => set("videoUrl", e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... atau /uploads/tutorials/video.mp4"
          />
          <FieldError>{errors.videoUrl}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="thumbnailUrl" hint="URL gambar thumbnail, opsional">
            Thumbnail
          </Label>
          <Input
            id="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={(e) => set("thumbnailUrl", e.target.value)}
            placeholder="/images/tutorial-oss.svg"
          />
        </div>
        <div>
          <Label htmlFor="duration" hint="Contoh: 12:30">
            Durasi
          </Label>
          <Input
            id="duration"
            value={form.duration}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="10:25"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content" hint="Mendukung Markdown">
          Materi / Deskripsi Lengkap
        </Label>
        <Textarea
          id="content"
          rows={9}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          placeholder="Tuliskan ringkasan materi, langkah penting, atau catatan video."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="order">Urutan</Label>
          <Input
            id="order"
            type="number"
            value={form.order}
            onChange={(e) => set("order", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status" required>
            Status
          </Label>
          <Select
            id="status"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="publishedAt" hint="Kosongkan untuk otomatis">
            Tanggal Terbit
          </Label>
          <Input
            id="publishedAt"
            type="datetime-local"
            value={form.publishedAt}
            onChange={(e) => set("publishedAt", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          {isEdit ? "Simpan Perubahan" : "Tambah Tutorial"}
        </SubmitButton>
      </div>
    </form>
  );
}

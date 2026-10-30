"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, Save, UploadCloud, X } from "lucide-react";
import { createNews, updateNews } from "@/lib/actions/news";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { newsSchema } from "@/lib/validation";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { slugify, toDateTimeLocalValue } from "@/lib/utils";
import { uploadPublicFile } from "@/lib/upload-client";

interface NewsFormProps {
  divisions: { id: number; name: string }[];
  news?: {
    id: number;
    divisionId: number | null;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    images: string[];
    status: string;
    publishedAt: Date | null;
  } | null;
}

export function NewsForm({ divisions, news }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!news;
  const extraImagesInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    divisionId: String(news?.divisionId ?? ""),
    title: news?.title ?? "",
    slug: news?.slug ?? "",
    category: news?.category ?? NEWS_CATEGORIES[0],
    excerpt: news?.excerpt ?? "",
    content: news?.content ?? "",
    coverImage: news?.coverImage ?? "",
    status: news?.status ?? "draft",
    publishedAt: toDateTimeLocalValue(news?.publishedAt),
  });
  // images[] state terpisah dari form biasa
  const [extraImages, setExtraImages] = useState<string[]>(news?.images ?? []);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const handleTitle = (value: string) => {
    setForm((f) => ({
      ...f,
      title: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
    setErrors((e) => ({ ...e, title: "" }));
  };

  async function uploadCoverFile(file: File): Promise<string | null> {
    try {
      return await uploadPublicFile(file, "image");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gambar gagal diunggah.");
      return null;
    }
  }

  async function handleCoverUpload() {
    if (!selectedCoverFile) return;
    setCoverUploading(true);
    const url = await uploadCoverFile(selectedCoverFile);
    if (url) {
      set("coverImage", url);
      setSelectedCoverFile(null);
      toast.success("Gambar cover berhasil diunggah.");
    }
    setCoverUploading(false);
  }

  function handleExtraFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const valid = files.filter((f) => {
      if (!allowed.includes(f.type)) { toast.error(`${f.name}: format tidak didukung.`); return false; }
      if (f.size > 8 * 1024 * 1024) { toast.error(`${f.name}: maksimal 8 MB.`); return false; }
      return true;
    });
    setPendingFiles((prev) => [...prev, ...valid]);
    if (extraImagesInputRef.current) extraImagesInputRef.current.value = "";
  }

  async function handleUploadExtraImages() {
    if (pendingFiles.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of pendingFiles) {
      try {
        const url = await uploadPublicFile(file, "image");
        uploaded.push(url);
      } catch {
        toast.error(`${file.name} gagal diunggah, dilewati.`);
      }
    }
    setExtraImages((prev) => [...prev, ...uploaded]);
    setPendingFiles([]);
    toast.success(`${uploaded.length} gambar berhasil diunggah.`);
    setUploading(false);
  }

  function removeExtraImage(idx: number) {
    setExtraImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function removePending(idx: number) {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = newsSchema.safeParse({ ...form, images: extraImages });
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
    let coverImage = form.coverImage;
    if (selectedCoverFile) {
      const uploadedUrl = await uploadCoverFile(selectedCoverFile);
      if (!uploadedUrl) { setLoading(false); return; }
      coverImage = uploadedUrl;
    }
    const fd = new FormData();
    if (news) fd.set("id", String(news.id));
    for (const [key, value] of Object.entries({ ...parsed.data, coverImage })) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) fd.set(key, JSON.stringify(value));
      else if (value instanceof Date) fd.set(key, value.toISOString());
      else fd.set(key, String(value));
    }
    const result = isEdit ? await updateNews(fd) : await createNews(fd);
    setLoading(false);
    if (result.ok) {
      toast.success(isEdit ? "Berita berhasil diperbarui." : "Berita berhasil ditambahkan.");
      router.push("/admin/news");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div>
        <Label htmlFor="title" required>Judul</Label>
        <Input id="title" value={form.title} onChange={(e) => handleTitle(e.target.value)} />
        <FieldError>{errors.title}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug" required hint="URL unik">Slug</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }}
          />
          <FieldError>{errors.slug}</FieldError>
        </div>
        <div>
          <Label htmlFor="category" required>Kategori</Label>
          <Select id="category" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
          <FieldError>{errors.category}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="divisionId" hint="Opsional">Bidang Terkait</Label>
          <Select id="divisionId" value={form.divisionId} onChange={(e) => set("divisionId", e.target.value)}>
            <option value="">- Tanpa bidang -</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Label htmlFor="coverImageFile" hint="Pilih dari PC atau gunakan URL di bawah">Gambar Cover</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="coverImageFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setSelectedCoverFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
            />
            <button
              type="button"
              onClick={handleCoverUpload}
              disabled={!selectedCoverFile || coverUploading || loading}
              className="btn-secondary whitespace-nowrap"
            >
              <UploadCloud className="h-4 w-4" />
              {coverUploading ? "Mengunggah..." : "Unggah"}
            </button>
          </div>
          {selectedCoverFile ? (
            <div className="mt-2 flex items-center gap-2 text-xs text-primary-700">
              <span className="truncate">{selectedCoverFile.name}</span>
              <button type="button" onClick={() => setSelectedCoverFile(null)} className="rounded p-0.5 hover:bg-primary-100" aria-label="Hapus pilihan gambar">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
          {form.coverImage && (
            <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.coverImage} alt="Cover" className="max-h-28 w-full object-contain" />
            </div>
          )}
          <div className="mt-3 border-t border-slate-200 pt-3">
            <Label htmlFor="coverImage" hint="Atau masukkan URL gambar">URL Gambar</Label>
            <Input
              id="coverImage"
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://... atau /uploads/news/berita.jpg"
            />
          </div>
        </div>
      </div>

      {/* ========== GAMBAR TAMBAHAN ========== */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          📷 Gambar Tambahan
          <span className="ml-2 text-xs font-normal text-slate-400">(opsional — akan ditampilkan sebagai slideshow di bawah cover)</span>
        </p>

        {/* Gambar yang sudah diupload */}
        {extraImages.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {extraImages.map((url, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Gambar ${idx + 1}`} className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(idx)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Hapus gambar"
                >
                  <X className="h-3 w-3" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* File yang dipilih tapi belum diupload */}
        {pendingFiles.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-amber-700">Siap diunggah ({pendingFiles.length} file):</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {pendingFiles.map((file, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-20 w-full object-cover opacity-70" />
                  <button
                    type="button"
                    onClick={() => removePending(idx)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <input
            ref={extraImagesInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleExtraFilesChange}
            className="hidden"
            id="extra-images-input"
          />
          <button
            type="button"
            onClick={() => extraImagesInputRef.current?.click()}
            className="btn-secondary"
          >
            <ImagePlus className="h-4 w-4" />
            Pilih Gambar
          </button>
          {pendingFiles.length > 0 && (
            <button
              type="button"
              onClick={handleUploadExtraImages}
              disabled={uploading}
              className="btn-primary"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              {uploading ? "Mengunggah..." : `Unggah ${pendingFiles.length} Gambar`}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">Format: JPG, PNG, WebP, GIF. Maks 8 MB per file. Bisa pilih banyak sekaligus.</p>
      </div>

      <div>
        <Label htmlFor="excerpt" required hint="Ringkasan singkat di kartu berita">Ringkasan</Label>
        <Textarea id="excerpt" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        <FieldError>{errors.excerpt}</FieldError>
      </div>

      <div>
        <Label htmlFor="content" required hint="Mendukung Markdown (judul ##, list -, angka 1.)">Konten Berita</Label>
        <Textarea id="content" rows={12} value={form.content} onChange={(e) => set("content", e.target.value)} />
        <FieldError>{errors.content}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="status" required>Status</Label>
          <Select id="status" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Terbit</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="publishedAt" hint="Kosongkan agar terisi otomatis">Tanggal Terbit</Label>
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
          {isEdit ? "Simpan Perubahan" : "Tambah Berita"}
        </SubmitButton>
      </div>
    </form>
  );
}

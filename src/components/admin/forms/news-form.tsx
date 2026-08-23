"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, UploadCloud, X } from "lucide-react";
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
    status: string;
    publishedAt: Date | null;
  } | null;
}

export function NewsForm({ divisions, news }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!news;

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
      toast.error(
        error instanceof Error ? error.message : "Gambar gagal diunggah."
      );
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
      toast.success("Gambar berhasil diunggah. Jangan lupa simpan berita.");
    }
    setCoverUploading(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = newsSchema.safeParse(form);
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
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      coverImage = uploadedUrl;
    }
    const fd = new FormData();
    if (news) fd.set("id", String(news.id));
    for (const [key, value] of Object.entries({ ...parsed.data, coverImage })) {
      if (value === undefined || value === null) continue;
      if (value instanceof Date) fd.set(key, value.toISOString());
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
        <Label htmlFor="title" required>
          Judul
        </Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => handleTitle(e.target.value)}
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
          <Select
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          >
            {NEWS_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <FieldError>{errors.category}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="divisionId" hint="Opsional">
            Bidang Terkait
          </Label>
          <Select
            id="divisionId"
            value={form.divisionId}
            onChange={(e) => set("divisionId", e.target.value)}
          >
            <option value="">- Tanpa bidang -</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <Label htmlFor="coverImageFile" hint="Pilih dari PC atau gunakan URL di bawah">
            Gambar Cover
          </Label>
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
              <button
                type="button"
                onClick={() => setSelectedCoverFile(null)}
                className="rounded p-0.5 hover:bg-primary-100"
                aria-label="Hapus pilihan gambar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
          <div className="mt-3 border-t border-slate-200 pt-3">
            <Label htmlFor="coverImage" hint="Atau masukkan URL gambar">
              URL Gambar
            </Label>
            <Input
              id="coverImage"
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://... atau /uploads/news/berita.jpg"
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt" required hint="Ringkasan singkat di kartu berita">
          Ringkasan
        </Label>
        <Textarea
          id="excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
        <FieldError>{errors.excerpt}</FieldError>
      </div>

      <div>
        <Label htmlFor="content" required hint="Mendukung Markdown (judul ##, list -, angka 1.)">
          Konten Berita
        </Label>
        <Textarea
          id="content"
          rows={12}
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
        />
        <FieldError>{errors.content}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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
          <Label htmlFor="publishedAt" hint="Kosongkan agar terisi otomatis">
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
          {isEdit ? "Simpan Perubahan" : "Tambah Berita"}
        </SubmitButton>
      </div>
    </form>
  );
}

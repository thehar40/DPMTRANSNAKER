"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
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
    const fd = new FormData();
    if (news) fd.set("id", String(news.id));
    for (const [key, value] of Object.entries(parsed.data)) {
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
        <div>
          <Label htmlFor="coverImage" hint="URL gambar, opsional">
            Gambar Cover
          </Label>
          <Input
            id="coverImage"
            value={form.coverImage}
            onChange={(e) => set("coverImage", e.target.value)}
            placeholder="/images/berita.jpg"
          />
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

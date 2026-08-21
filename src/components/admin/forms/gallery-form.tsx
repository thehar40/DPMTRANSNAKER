"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { createGallery, updateGallery } from "@/lib/actions/galleries";
import {
  FieldError,
  Input,
  Label,
  Select,
  SubmitButton,
  Textarea,
} from "@/components/ui/fields";
import { gallerySchema } from "@/lib/validation";

interface GalleryFormProps {
  gallery?: {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    imageUrl: string;
    order: number;
    status: string;
  } | null;
}

export function GalleryForm({ gallery }: GalleryFormProps) {
  const router = useRouter();
  const isEdit = !!gallery;

  const [form, setForm] = useState({
    title: gallery?.title ?? "",
    description: gallery?.description ?? "",
    category: gallery?.category ?? "",
    imageUrl: gallery?.imageUrl ?? "",
    order: String(gallery?.order ?? 0),
    status: gallery?.status ?? "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = gallerySchema.safeParse(form);
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
    if (gallery) fd.set("id", String(gallery.id));
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value !== undefined && value !== null) fd.set(key, String(value));
    }
    const result = isEdit ? await updateGallery(fd) : await createGallery(fd);
    setLoading(false);
    if (result.ok) {
      toast.success(isEdit ? "Galeri berhasil diperbarui." : "Galeri berhasil ditambahkan.");
      router.push("/admin/galleries");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card space-y-5 p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="title" required>
            Judul
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <Label htmlFor="category" hint="Contoh: Pelayanan, Pelatihan">
            Kategori
          </Label>
          <Input
            id="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl" required hint="Lokasi file di public/ atau URL">
          URL Gambar
        </Label>
        <Input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(e) => set("imageUrl", e.target.value)}
          placeholder="/images/kegiatan.jpg"
        />
        <FieldError>{errors.imageUrl}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="order">Urutan</Label>
          <Input
            id="order"
            type="number"
            value={form.order}
            onChange={(e) => set("order", e.target.value)}
          />
          <FieldError>{errors.order}</FieldError>
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
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </Select>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <SubmitButton loading={loading}>
          <Save className="h-4 w-4" />
          {isEdit ? "Simpan Perubahan" : "Tambah Galeri"}
        </SubmitButton>
      </div>
    </form>
  );
}

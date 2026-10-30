"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImagePlus, Loader2, Save, UploadCloud, X } from "lucide-react";
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
import { uploadPublicFile } from "@/lib/upload-client";

interface GalleryFormProps {
  gallery?: {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    imageUrl: string;
    images?: string[];
    order: number;
    status: string;
  } | null;
}

export function GalleryForm({ gallery }: GalleryFormProps) {
  const router = useRouter();
  const isEdit = !!gallery;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraImagesInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: gallery?.title ?? "",
    description: gallery?.description ?? "",
    category: gallery?.category ?? "",
    imageUrl: gallery?.imageUrl ?? "",
    order: String(gallery?.order ?? 0),
    status: gallery?.status ?? "active",
  });
  const [extraImages, setExtraImages] = useState<string[]>(gallery?.images ?? []);
  const [pendingExtraFiles, setPendingExtraFiles] = useState<File[]>([]);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  function handleCoverFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Format gambar yang didukung: JPG, PNG, WebP, GIF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 8 MB.");
      return;
    }

    setPreviewFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }

  async function handleCoverUploadClick() {
    if (!previewFile) return;
    setUploadingCover(true);
    try {
      const url = await uploadPublicFile(previewFile, "image");
      set("imageUrl", url);
      toast.success("Gambar utama berhasil diunggah.");
      setPreviewFile(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gambar gagal diunggah.");
    } finally {
      setUploadingCover(false);
    }
  }

  function handleRemoveCoverPreview() {
    setPreviewFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Handle multi-image additions
  function handleExtraFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const valid = files.filter((f) => {
      if (!allowed.includes(f.type)) {
        toast.error(`${f.name}: format tidak didukung.`);
        return false;
      }
      if (f.size > 8 * 1024 * 1024) {
        toast.error(`${f.name}: maksimal 8 MB.`);
        return false;
      }
      return true;
    });
    setPendingExtraFiles((prev) => [...prev, ...valid]);
    if (extraImagesInputRef.current) extraImagesInputRef.current.value = "";
  }

  async function handleUploadExtraImages() {
    if (pendingExtraFiles.length === 0) return;
    setUploadingExtra(true);
    const uploaded: string[] = [];
    for (const file of pendingExtraFiles) {
      try {
        const url = await uploadPublicFile(file, "image");
        uploaded.push(url);
      } catch {
        toast.error(`${file.name} gagal diunggah, dilewati.`);
      }
    }
    setExtraImages((prev) => [...prev, ...uploaded]);
    // If cover is empty, automatically set first uploaded image as cover
    if (!form.imageUrl && uploaded.length > 0) {
      set("imageUrl", uploaded[0]);
    }
    setPendingExtraFiles([]);
    toast.success(`${uploaded.length} gambar tambahan berhasil diunggah.`);
    setUploadingExtra(false);
  }

  function removeExtraImage(idx: number) {
    setExtraImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function removePendingExtra(idx: number) {
    setPendingExtraFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = form.imageUrl;
    // Auto-upload preview file if user hasn't clicked upload yet
    if (previewFile) {
      try {
        finalImageUrl = await uploadPublicFile(previewFile, "image");
        set("imageUrl", finalImageUrl);
      } catch (err) {
        setLoading(false);
        toast.error(err instanceof Error ? err.message : "Gagal mengunggah gambar utama.");
        return;
      }
    }

    // Fallback if main image is empty but extra images exist
    if (!finalImageUrl && extraImages.length > 0) {
      finalImageUrl = extraImages[0];
    }

    const parsed = gallerySchema.safeParse({
      ...form,
      imageUrl: finalImageUrl,
      images: extraImages,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.errors) {
        const key = String(issue.path[0] ?? "");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      setLoading(false);
      toast.error("Mohon periksa kembali isian formulir.");
      return;
    }

    const fd = new FormData();
    if (gallery) fd.set("id", String(gallery.id));
    for (const [key, value] of Object.entries(parsed.data)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) fd.set(key, JSON.stringify(value));
      else fd.set(key, String(value));
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
            Judul Galeri
          </Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          <FieldError>{errors.title}</FieldError>
        </div>
        <div>
          <Label htmlFor="category" hint="Contoh: Pelayanan, Pelatihan, Sosialisasi">
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

      {/* Main Image Upload Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="mb-2 block text-sm font-semibold text-slate-700">
          Foto Utama (Sampul) <span className="text-red-500">*</span>
        </p>
        <p className="mb-3 text-xs text-slate-500">
          Foto ini akan menjadi thumbnail utama di kartu galeri dan slide pertama.
        </p>

        {/* Preview area */}
        {(previewUrl || form.imageUrl) && (
          <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl ?? form.imageUrl}
              alt="Pratinjau gambar"
              className="max-h-60 w-full object-contain"
            />
            {previewUrl && (
              <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                <span className="text-xs text-slate-500 truncate max-w-[200px]">
                  {previewFile?.name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRemoveCoverPreview}
                    className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCoverUploadClick}
                    disabled={uploadingCover}
                    className="btn-primary !px-3 !py-1.5 !text-xs"
                  >
                    {uploadingCover ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <ImagePlus className="h-3.5 w-3.5" />
                    )}
                    {uploadingCover ? "Mengunggah..." : "Unggah Gambar Ini"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File picker */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              id="gallery-file-input"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleCoverFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary w-full sm:w-auto"
            >
              <ImagePlus className="h-4 w-4" />
              Pilih Gambar dari Komputer
            </button>
            <p className="mt-1.5 text-xs text-slate-400">
              Format: JPG, PNG, WebP, GIF. Maksimal 8 MB.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:block">atau</span>
          </div>

          {/* Manual URL input */}
          <div className="flex-1">
            <Input
              id="imageUrl"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="/images/kegiatan.jpg atau https://..."
            />
            <p className="mt-1.5 text-xs text-slate-400">Tempel URL gambar manual</p>
          </div>
        </div>

        <FieldError>{errors.imageUrl}</FieldError>
      </div>

      {/* Multi-Image / Slides Section */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="mb-1 text-sm font-semibold text-slate-700">
          📷 Foto Tambahan (Tampilan Slide / Multi-Gambar)
        </p>
        <p className="mb-3 text-xs text-slate-500">
          Unggah beberapa foto sekaligus untuk ditampilkan sebagai slideshow ketika pengunjung membuka galeri ini.
        </p>

        {/* Existing uploaded extra images */}
        {extraImages.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {extraImages.map((url, idx) => (
              <div key={idx} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Slide ${idx + 1}`} className="h-20 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExtraImage(idx)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="Hapus gambar"
                >
                  <X className="h-3 w-3" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[10px] text-white">
                  Slide {idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pending files */}
        {pendingExtraFiles.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-amber-700">
              Siap diunggah ({pendingExtraFiles.length} file):
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {pendingExtraFiles.map((file, idx) => (
                <div key={idx} className="group relative overflow-hidden rounded-lg border border-amber-200 bg-amber-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-full object-cover opacity-75"
                  />
                  <button
                    type="button"
                    onClick={() => removePendingExtra(idx)}
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
            id="gallery-extra-images-input"
          />
          <button
            type="button"
            onClick={() => extraImagesInputRef.current?.click()}
            className="btn-secondary"
          >
            <ImagePlus className="h-4 w-4" />
            Pilih Beberapa Gambar
          </button>
          {pendingExtraFiles.length > 0 && (
            <button
              type="button"
              onClick={handleUploadExtraImages}
              disabled={uploadingExtra}
              className="btn-primary"
            >
              {uploadingExtra ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
              {uploadingExtra ? "Mengunggah..." : `Unggah ${pendingExtraFiles.length} Gambar Tambahan`}
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Pilih file foto dari laptop/PC sekaligus (bisa tahan tombol Ctrl/Shift untuk memilih beberapa).
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="order">Urutan Tampil</Label>
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

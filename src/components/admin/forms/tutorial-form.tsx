"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ImagePlus, PlayCircle, Save, UploadCloud, Wand2, X } from "lucide-react";
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
import {
  getVideoEmbedUrl,
  getYouTubeVideoId,
  isDirectVideoUrl,
  slugify,
  toDateTimeLocalValue,
} from "@/lib/utils";
import { SmartImage } from "@/components/ui/smart-image";
import { uploadPublicFile } from "@/lib/upload-client";

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
  const [selectedThumbFile, setSelectedThumbFile] = useState<File | null>(null);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbFromVideo, setThumbFromVideo] = useState(false);
  const [preview, setPreview] = useState(false);

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
    try {
      return await uploadPublicFile(file, "video");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Video gagal diunggah."
      );
      return null;
    }
  }

  async function uploadThumbFromFile(file: File): Promise<string | null> {
    try {
      return await uploadPublicFile(file, "image");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Thumbnail gagal diunggah."
      );
      return null;
    }
  }

  async function handleThumbUploadClick() {
    if (!selectedThumbFile) return;
    setThumbUploading(true);
    const url = await uploadThumbFromFile(selectedThumbFile);
    setThumbUploading(false);
    if (url) {
      set("thumbnailUrl", url);
      setSelectedThumbFile(null);
      toast.success("Thumbnail berhasil diunggah.");
    }
  }

  function handleVideoUrlChange(value: string) {
    set("videoUrl", value);
    if (!form.thumbnailUrl.trim()) {
      const videoId = getYouTubeVideoId(value);
      if (!videoId) return;
      setThumbFromVideo(true);
      loadYouTubeThumbnail(videoId, (thumbnail) => {
        setThumbFromVideo(false);
        if (thumbnail) {
          set("thumbnailUrl", thumbnail);
        }
      });
    }
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
        if (!form.thumbnailUrl.trim()) {
          await handleThumbFromVideo(url);
        }
      }
    } catch {
      toast.error("Video gagal diunggah. Silakan coba lagi.");
    } finally {
      setUploading(false);
    }
  }

  function loadYouTubeThumbnail(videoId: string, onDone: (url: string | null) => void) {
    const candidates = [
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    ];
    let index = 0;

    function tryLoad() {
      if (index >= candidates.length) {
        onDone(null);
        return;
      }
      const image = new Image();
      image.onload = () => onDone(candidates[index]);
      image.onerror = () => {
        index += 1;
        tryLoad();
      };
      image.src = candidates[index];
    }

    tryLoad();
  }

  function extractVideoFrame(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.muted = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.src = url;

      const timeout = window.setTimeout(() => {
        reject(new Error("Waktu ekstraksi frame habis."));
      }, 20000);

      video.onloadeddata = () => {
        const duration = Number.isFinite(video.duration) ? video.duration : 5;
        video.currentTime = Math.min(1.5, Math.max(0, duration * 0.25));
      };
      video.onseeked = () => {
        const width = Math.min(video.videoWidth || 640, 640);
        const ratio = (video.videoHeight || 360) / (video.videoWidth || 640);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = Math.round(width * ratio);
        const context = canvas.getContext("2d");
        if (!context) {
          window.clearTimeout(timeout);
          reject(new Error("Canvas tidak tersedia."));
          return;
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        window.clearTimeout(timeout);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      video.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error("Video tidak dapat dibaca untuk diambil gambar."));
      };
    });
  }

  function dataUrlToFile(dataUrl: string): File {
    const [meta, data] = dataUrl.split(",");
    const mime = meta.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new File([bytes], "thumbnail-video.jpg", { type: mime });
  }

  async function handleThumbFromVideo(videoUrlOverride?: string) {
    const videoUrl = (videoUrlOverride ?? form.videoUrl).trim();
    if (!videoUrl) {
      toast.error("Unggah video atau isi URL video terlebih dahulu.");
      return;
    }

    setThumbFromVideo(true);
    try {
      const youtubeId = getYouTubeVideoId(videoUrl);
      if (youtubeId) {
        const thumbUrl = await new Promise<string | null>((resolve) =>
          loadYouTubeThumbnail(youtubeId, resolve)
        );
        if (thumbUrl) {
          set("thumbnailUrl", thumbUrl);
          toast.success("Thumbnail diambil dari video YouTube.");
          return;
        }
        throw new Error("Thumbnail YouTube tidak ditemukan.");
      }

      if (isDirectVideoUrl(videoUrl)) {
        const dataUrl = await extractVideoFrame(videoUrl);
        const file = dataUrlToFile(dataUrl);
        const url = await uploadThumbFromFile(file);
        if (!url) throw new Error("Thumbnail gagal diunggah.");
        set("thumbnailUrl", url);
        toast.success("Gambar diambil dari video dan diunggah.");
        return;
      }

      const response = await fetch(
        `/api/admin/uploads/video-thumb?url=${encodeURIComponent(videoUrl)}`
      );
      const body = await response.json().catch(() => ({}));
      if (response.ok && body.thumbnailUrl) {
        set("thumbnailUrl", String(body.thumbnailUrl));
        toast.success("Thumbnail diambil dari video penyedia.");
        return;
      }
      throw new Error(body.error ?? "Thumbnail tidak dapat diambil.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Thumbnail gagal diambil."
      );
    } finally {
      setThumbFromVideo(false);
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

      let thumbnailUrl = form.thumbnailUrl;
      if (selectedThumbFile) {
        const uploadedThumb = await uploadThumbFromFile(selectedThumbFile);
        if (!uploadedThumb) return;
        thumbnailUrl = uploadedThumb;
      }

      const fd = new FormData();
      if (tutorial) fd.set("id", String(tutorial.id));
      const payload = { ...parsed.data, videoUrl, thumbnailUrl };
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
              Pada Vercel, aktifkan Vercel Blob Storage agar upload langsung
              dari PC tersimpan permanen.
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
            onChange={(e) => handleVideoUrlChange(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... atau /uploads/tutorials/video.mp4"
          />
          <FieldError>{errors.videoUrl}</FieldError>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Thumbnail Tutorial</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Upload gambar dari PC, masukkan URL, atau ambil thumbnail
              otomatis dari videonya (YouTube, Vimeo, MP4).
            </p>
          </div>
          <ImagePlus className="h-5 w-5 shrink-0 text-primary-600" />
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Label htmlFor="thumbnailFile">Upload Gambar Thumbnail</Label>
            <Input
              id="thumbnailFile"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setSelectedThumbFile(e.target.files?.[0] ?? null)}
              className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary-800"
            />
            {selectedThumbFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-primary-700">
                <span className="truncate">{selectedThumbFile.name}</span>
                <button
                  type="button"
                  onClick={() => setSelectedThumbFile(null)}
                  className="rounded p-0.5 hover:bg-primary-100"
                  aria-label="Hapus pilihan thumbnail"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleThumbUploadClick}
            disabled={!selectedThumbFile || thumbUploading || loading}
            className="btn-secondary whitespace-nowrap"
          >
            <UploadCloud className="h-4 w-4" />
            {thumbUploading ? "Mengunggah..." : "Unggah Gambar"}
          </button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <Label htmlFor="thumbnailUrl" hint="Diisi otomatis setelah upload">
              URL Thumbnail
            </Label>
            <Input
              id="thumbnailUrl"
              value={form.thumbnailUrl}
              onChange={(e) => set("thumbnailUrl", e.target.value)}
              placeholder="https://... atau /images/tutorial-oss.svg"
            />
            <FieldError>{errors.thumbnailUrl}</FieldError>
          </div>
          <button
            type="button"
            onClick={() => handleThumbFromVideo()}
            disabled={!form.videoUrl || thumbFromVideo || thumbUploading || loading}
            className="btn-secondary whitespace-nowrap"
          >
            <Wand2 className="h-4 w-4" />
            {thumbFromVideo ? "Mengambil..." : "Ambil dari Video"}
          </button>
        </div>

        {form.thumbnailUrl ? (
          <div className="mt-4 flex items-start gap-3">
            <SmartImage
              src={form.thumbnailUrl}
              alt="Preview thumbnail tutorial"
              className="h-24 w-40 shrink-0 rounded-xl ring-1 ring-slate-200"
              iconClassName="h-6 w-6"
            />
            <p className="pt-2 text-xs leading-relaxed text-slate-400">
              Thumbnail ini akan tampil pada kartu Tutorial, halaman detail,
              dan beranda.
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Preview Tutorial</h3>
            <p className="mt-1 text-xs text-slate-500">
              Periksa tampilan judul, thumbnail, dan video sebelum diterbitkan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPreview((current) => !current)}
            className="btn-secondary"
          >
            {preview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {preview ? "Tutup Preview" : "Lihat Preview"}
          </button>
        </div>
        {preview ? (
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-video overflow-hidden bg-primary-950">
              {getVideoEmbedUrl(form.videoUrl) ? (
                <iframe
                  src={getVideoEmbedUrl(form.videoUrl) ?? undefined}
                  title={`Preview ${form.title || "tutorial"}`}
                  className="h-full w-full"
                  allowFullScreen
                />
              ) : isDirectVideoUrl(form.videoUrl) ? (
                <video src={form.videoUrl} controls className="h-full w-full" />
              ) : (
                <>
                  <SmartImage
                    src={form.thumbnailUrl}
                    alt="Thumbnail preview tutorial"
                    className="h-full w-full opacity-50"
                    iconClassName="h-14 w-14 text-primary-200"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-950/55 text-center text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-400 text-primary-950">
                      <PlayCircle className="h-6 w-6" />
                    </span>
                    <p className="mt-3 text-sm font-bold">Video Segera Hadir</p>
                  </div>
                </>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-primary-600">
                {form.category || "Kategori tutorial"}
              </p>
              <h4 className="mt-1 text-xl font-bold text-slate-900">
                {form.title || "Judul tutorial"}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {form.description || "Deskripsi tutorial akan tampil di sini."}
              </p>
            </div>
          </div>
        ) : null}
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

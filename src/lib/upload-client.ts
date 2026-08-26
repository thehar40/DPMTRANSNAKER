"use client";

import { upload } from "@vercel/blob/client";

export type UploadKind = "video" | "image";

function safeFileName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]/g, "-");
}

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const SUPPORTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

function isSupportedType(kind: UploadKind, type: string): boolean {
  if (!type) return false;
  return kind === "image"
    ? SUPPORTED_IMAGE_TYPES.includes(type)
    : SUPPORTED_VIDEO_TYPES.includes(type);
}

export interface UploadOptions {
  useProvider?: "gcs" | "blob" | "local" | "supabase";
}

export async function uploadPublicFile(
  file: File,
  kind: UploadKind,
  options: UploadOptions = {}
): Promise<string> {
  const provider =
    options.useProvider ??
    (process.env.NEXT_PUBLIC_STORAGE_PROVIDER || "local");

  if (provider === "gcs") {
    return uploadToGcs(file, kind);
  }

  if (provider === "supabase") {
    return uploadToSupabase(file, kind);
  }

  if (provider === "blob") {
    return uploadToBlob(file, kind);
  }

  return uploadToLocal(file, kind);
}

async function uploadToBlob(file: File, kind: UploadKind): Promise<string> {
  const pathname = `dpmtransnaker/${kind}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/admin/uploads/blob",
    clientPayload: JSON.stringify({ kind }),
  });
  return blob.url;
}

async function uploadToGcs(file: File, kind: UploadKind): Promise<string> {
  const response = await fetch("/api/admin/uploads/gcs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kind,
      fileName: file.name,
      contentType: file.type,
    }),
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.uploadUrl || !body.publicUrl) {
    throw new Error(body.error ?? "Gagal menyiapkan upload.");
  }

  const putResponse = await fetch(String(body.uploadUrl), {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "x-goog-acl": "public-read",
    },
    body: file,
  });
  if (!putResponse.ok) {
    throw new Error(
      "Upload ke Google Cloud Storage gagal. Periksa CORS dan izin bucket."
    );
  }
  return String(body.publicUrl);
}

async function uploadToSupabase(file: File, kind: UploadKind): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "dpmtransnaker";

  if (!url || !anonKey) {
    throw new Error(
      "Supabase belum dikonfigurasi. Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const objectPath = `${kind}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const response = await fetch(
    `${url.replace(/\/$/, "")}/storage/v1/object/${bucket}/${objectPath}`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
        "x-upsert": "true",
        "content-type": "application/octet-stream",
      },
      body: file,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Upload ke Supabase Storage gagal. Pastikan bucket publik dan kebijakan izin upload sudah diaktifkan."
    );
  }

  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${objectPath}`;
}

async function uploadToLocal(file: File, kind: UploadKind): Promise<string> {
  const endpoint =
    kind === "image"
      ? "/api/admin/uploads/image"
      : "/api/admin/tutorials/upload";
  const body = new FormData();
  body.set("file", file);
  const response = await fetch(endpoint, { method: "POST", body });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "File gagal diunggah.");
  }

  return String(result.url);
}

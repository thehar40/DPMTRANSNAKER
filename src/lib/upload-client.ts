"use client";

import { upload } from "@vercel/blob/client";

export type UploadKind = "video" | "image";

function safeFileName(name: string): string {
  return name.replace(/[^A-Za-z0-9._-]/g, "-");
}

export async function uploadPublicFile(
  file: File,
  kind: UploadKind
): Promise<string> {
  const blobEnabled = process.env.NEXT_PUBLIC_BLOB_UPLOAD_ENABLED === "true";

  if (blobEnabled) {
    const pathname = `dpmtransnaker/${kind}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/admin/uploads/blob",
      clientPayload: JSON.stringify({ kind }),
    });
    return blob.url;
  }

  const body = new FormData();
  body.set("file", file);
  const endpoint =
    kind === "image"
      ? "/api/admin/uploads/image"
      : "/api/admin/tutorials/upload";
  const response = await fetch(endpoint, { method: "POST", body });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.url) {
    throw new Error(result.error ?? "File gagal diunggah.");
  }

  return String(result.url);
}

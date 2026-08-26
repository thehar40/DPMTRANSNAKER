import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createGcsSignedUpload, isGcsConfigured } from "@/lib/gcs";

export const runtime = "nodejs";

const IMAGE_MAX = 8 * 1024 * 1024;
const VIDEO_MAX = 500 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

function isAllowed(
  kind: string,
  contentType: string,
  fileName: string
): { ok: boolean; error?: string } {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (kind === "image") {
    if (!IMAGE_TYPES.includes(contentType)) {
      return {
        ok: false,
        error: "Format gambar yang didukung: JPG, PNG, WebP, atau GIF.",
      };
    }
    if (!["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
      return { ok: false, error: "Ekstensi gambar tidak didukung." };
    }
  } else {
    if (!VIDEO_TYPES.includes(contentType)) {
      return {
        ok: false,
        error: "Format video yang didukung: MP4, WebM, OGG, atau MOV.",
      };
    }
    if (!["mp4", "webm", "ogg", "mov"].includes(extension)) {
      return { ok: false, error: "Ekstensi video tidak didukung." };
    }
  }
  return { ok: true };
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }

  if (!isGcsConfigured()) {
    return NextResponse.json(
      { error: "Google Cloud Storage belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      kind?: string;
      fileName?: string;
      contentType?: string;
    };

    const kind = body.kind === "image" ? "image" : "video";
    const fileName = (body.fileName ?? "").trim();
    const contentType = (body.contentType ?? "").trim();

    if (!fileName) {
      return NextResponse.json({ error: "Nama file belum diisi." }, { status: 400 });
    }
    const check = isAllowed(kind, contentType, fileName);
    if (!check.ok) {
      return NextResponse.json({ error: check.error ?? "File tidak valid." }, { status: 400 });
    }

    const signed = await createGcsSignedUpload({ kind, fileName, contentType });
    if (!signed) {
      return NextResponse.json(
        { error: "Gagal membuat tanda tangan upload." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      uploadUrl: signed.uploadUrl,
      publicUrl: signed.publicUrl,
      headers: signed.headers,
      maxBytes: kind === "image" ? IMAGE_MAX : VIDEO_MAX,
    });
  } catch (error) {
    console.error("GCS upload error:", error);
    return NextResponse.json(
      { error: "Gagal menyiapkan upload. Periksa konfigurasi Google Cloud Storage." },
      { status: 500 }
    );
  }
}

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }

  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "Upload lokal tidak tersedia di Vercel. Aktifkan Vercel Blob Storage atau gunakan URL gambar.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File gambar belum dipilih." }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: "File gambar kosong." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 8 MB." },
        { status: 400 }
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension) || (file.type && !ALLOWED_TYPES.has(file.type))) {
      return NextResponse.json(
        { error: "Format gambar yang didukung: JPG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }

    const directory = path.join(process.cwd(), "public", "uploads", "news");
    await mkdir(directory, { recursive: true });
    const fileName = `${randomUUID()}${extension}`;
    await writeFile(path.join(directory, fileName), Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      ok: true,
      url: `/uploads/news/${fileName}`,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("News image upload error:", error);
    return NextResponse.json(
      { error: "Gambar gagal diunggah. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

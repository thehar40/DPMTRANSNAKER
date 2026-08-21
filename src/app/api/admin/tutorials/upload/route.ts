import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".mp4", ".webm", ".ogg", ".mov"]);
const ALLOWED_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
]);

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "File video belum dipilih." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "File video kosong atau tidak dapat dibaca." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Ukuran video maksimal 100 MB." },
        { status: 400 }
      );
    }

    const extension = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension) || (file.type && !ALLOWED_TYPES.has(file.type))) {
      return NextResponse.json(
        { error: "Format video yang didukung: MP4, WebM, OGG, atau MOV." },
        { status: 400 }
      );
    }

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "tutorials"
    );
    await mkdir(uploadDirectory, { recursive: true });

    const fileName = `${randomUUID()}${extension}`;
    const filePath = path.join(uploadDirectory, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({
      ok: true,
      url: `/uploads/tutorials/${fileName}`,
      name: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Tutorial upload error:", error);
    return NextResponse.json(
      { error: "Video gagal diunggah. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

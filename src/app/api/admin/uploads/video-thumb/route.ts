import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }

  try {
    const target = new URL(request.url).searchParams.get("url")?.trim() ?? "";
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return NextResponse.json(
        { error: "URL video tidak valid." },
        { status: 400 }
      );
    }

    if (parsed.protocol !== "https:") {
      return NextResponse.json(
        { error: "URL video harus diawali https://." },
        { status: 400 }
      );
    }

    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (!host.endsWith("vimeo.com")) {
      return NextResponse.json(
        { error: "Otomatis thumbnail hanya mendukung YouTube dan Vimeo." },
        { status: 400 }
      );
    }

    const oEmbedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(target)}`;
    const response = await fetch(oEmbedUrl, {
      signal: AbortSignal.timeout(8000),
      headers: { "User-Agent": "dpmtransnaker-website/1.0" },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "Video Vimeo tidak ditemukan atau privat." },
        { status: 404 }
      );
    }

    const data = (await response.json()) as { thumbnail_url?: string };
    if (!data.thumbnail_url) {
      return NextResponse.json(
        { error: "Thumbnail video tidak tersedia." },
        { status: 404 }
      );
    }

    return NextResponse.json({ thumbnailUrl: data.thumbnail_url });
  } catch (error) {
    console.error("Video thumbnail error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil thumbnail dari video." },
      { status: 500 }
    );
  }
}

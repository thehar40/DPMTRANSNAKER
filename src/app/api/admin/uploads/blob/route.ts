import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

function getUploadKind(clientPayload: string | null | undefined): "image" | "video" {
  try {
    const parsed = JSON.parse(clientPayload ?? "{}");
    return parsed.kind === "image" ? "image" : "video";
  } catch {
    return "video";
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Penyimpanan Vercel Blob belum dikonfigurasi. Hubungkan Blob Storage di Vercel lalu deploy ulang.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const currentSession = await getSession();
        if (!currentSession || currentSession.role !== "admin") {
          throw new Error("Akses tidak diizinkan.");
        }

        const kind = getUploadKind(clientPayload);
        return {
          allowedContentTypes: kind === "image" ? IMAGE_TYPES : VIDEO_TYPES,
          maximumSizeInBytes:
            kind === "image" ? 8 * 1024 * 1024 : 500 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ adminId: currentSession.sub, kind }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.info("Admin upload selesai:", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Vercel Blob upload error:", error);
    return NextResponse.json(
      { error: "File gagal diunggah. Periksa konfigurasi Blob dan coba lagi." },
      { status: 400 }
    );
  }
}

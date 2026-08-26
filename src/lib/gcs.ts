import { Storage } from "@google-cloud/storage";

export interface GcsSignedUpload {
  uploadUrl: string;
  publicUrl: string;
  headers: Record<string, string>;
}

let cachedBucket: import("@google-cloud/storage").Bucket | null = null;
let corsConfigured = false;

export function isGcsConfigured(): boolean {
  return (
    !!process.env.GCS_BUCKET &&
    !!process.env.GCS_CLIENT_EMAIL &&
    !!process.env.GCS_PRIVATE_KEY
  );
}

function getBucket(): import("@google-cloud/storage").Bucket | null {
  if (cachedBucket) return cachedBucket;
  const bucketName = process.env.GCS_BUCKET;
  const clientEmail = process.env.GCS_CLIENT_EMAIL;
  const privateKey = process.env.GCS_PRIVATE_KEY;
  const projectId = process.env.GCS_PROJECT_ID;

  if (!bucketName || !clientEmail || !privateKey) return null;

  const storage = new Storage({
    projectId: projectId || undefined,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
  });

  cachedBucket = storage.bucket(bucketName);
  return cachedBucket;
}

export function getGcsBucket(): import("@google-cloud/storage").Bucket | null {
  return getBucket();
}

// Mengeset CORS sekali (best-effort) supaya browser dapat upload langsung.
export async function ensureGcsCors(): Promise<void> {
  const bucket = getBucket();
  if (!bucket || corsConfigured) return;
  try {
    await bucket.setCorsConfiguration([
      {
        origin: ["*"],
        method: ["GET", "PUT", "POST", "HEAD"],
        responseHeader: [
          "Content-Type",
          "Content-Length",
          "x-goog-acl",
          "Cache-Control",
        ],
        maxAgeSeconds: 3600,
      },
    ]);
    corsConfigured = true;
  } catch {
    // Abaikan: admin boleh mengatur CORS manual pada bucket.
  }
}

export function createGcsObjectName(
  kind: "video" | "image",
  fileName: string
): string {
  const safe = fileName.replace(/[^A-Za-z0-9._-]/g, "-");
  const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";
  return `dpmtransnaker/${kind}/${randomUUID()}${safe}${
    extension ? "" : ""
  }`;
}

// Tambahan kecil agar nama unik tanpa dependensi node:crypto di edge.
function randomUUID(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function createGcsSignedUpload(params: {
  kind: "video" | "image";
  fileName: string;
  contentType: string;
}): Promise<GcsSignedUpload | null> {
  const bucket = getBucket();
  if (!bucket || params.contentType === "") return null;

  await ensureGcsCors();

  const objectName = createGcsObjectName(params.kind, params.fileName);
  const file = bucket.file(objectName);

  const headers: Record<string, string> = {
    "x-goog-acl": "public-read",
  };

  const [uploadUrl] = await file.getSignedUrl({
    action: "write",
    expires: Date.now() + 15 * 60 * 1000,
    contentType: params.contentType,
    extensionHeaders: headers,
    virtualHostedStyle: true,
  });

  const publicUrl = `https://${bucket.name}.storage.googleapis.com/${objectName}`;

  return { uploadUrl, publicUrl, headers };
}

import { getSession } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { z, type ZodTypeDef } from "zod";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function guardAdmin(): Promise<ActionResult | null> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "Sesi berakhir. Silakan login kembali." };
  }
  return null;
}

export function parseForm<T>(
  formData: FormData,
  schema: z.ZodType<T, ZodTypeDef, unknown>
): { data?: T; error?: string } {
  const raw = Object.fromEntries(formData.entries());
  const result = schema.safeParse(raw);
  if (!result.success) {
    const first = result.error.errors[0];
    return { error: first?.message ?? "Data tidak valid." };
  }
  return { data: result.data };
}

export function handleActionError(e: unknown): ActionResult {
  if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
    return { ok: false, error: "Slug sudah digunakan. Silakan gunakan slug lain." };
  }
  console.error(e);
  return { ok: false, error: "Terjadi kesalahan. Silakan coba lagi." };
}

export function getId(formData: FormData): number {
  const value = Number(formData.get("id"));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

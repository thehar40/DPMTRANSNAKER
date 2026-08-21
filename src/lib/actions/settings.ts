"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { settingSchema } from "@/lib/validation";
import {
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, settingSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    const clean = { ...data };
    for (const key of ["facebook", "instagram", "youtube", "mapEmbedUrl"] as const) {
      if (clean[key] === null) clean[key] = undefined;
    }
    await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: clean,
      create: { id: 1, ...clean },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

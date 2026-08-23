"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validation";
import {
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, profileSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        welcomeTitle: data.welcomeTitle,
        welcomeName: data.welcomeName ?? null,
        welcomePosition: data.welcomePosition ?? null,
        welcomePhoto: data.welcomePhoto ?? null,
        welcomeText: data.welcomeText,
        vision: data.vision,
        mission: data.mission,
        dutiesFunctions: data.dutiesFunctions,
        serviceValues: data.serviceValues,
      },
      create: {
        id: 1,
        welcomeTitle: data.welcomeTitle,
        welcomeName: data.welcomeName ?? null,
        welcomePosition: data.welcomePosition ?? null,
        welcomePhoto: data.welcomePhoto ?? null,
        welcomeText: data.welcomeText,
        vision: data.vision,
        mission: data.mission,
        dutiesFunctions: data.dutiesFunctions,
        serviceValues: data.serviceValues,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

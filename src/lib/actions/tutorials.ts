"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { tutorialSchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

function revalidateTutorialPages() {
  revalidatePath("/", "layout");
  revalidatePath("/tutorial");
}

export async function createTutorial(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, tutorialSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? new Date()
        : (data.publishedAt ?? null);

    await prisma.tutorial.create({
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        description: data.description,
        content: data.content ?? null,
        videoUrl: data.videoUrl ?? null,
        thumbnailUrl: data.thumbnailUrl ?? null,
        duration: data.duration ?? null,
        order: data.order,
        status: data.status,
        publishedAt,
      },
    });
    revalidateTutorialPages();
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function updateTutorial(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, tutorialSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    const existing = await prisma.tutorial.findUnique({ where: { id } });
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? (existing?.publishedAt ?? new Date())
        : (data.publishedAt ?? null);

    await prisma.tutorial.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        category: data.category,
        description: data.description,
        content: data.content ?? null,
        videoUrl: data.videoUrl ?? null,
        thumbnailUrl: data.thumbnailUrl ?? null,
        duration: data.duration ?? null,
        order: data.order,
        status: data.status,
        publishedAt,
      },
    });
    revalidateTutorialPages();
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteTutorial(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.tutorial.delete({ where: { id } });
    revalidateTutorialPages();
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

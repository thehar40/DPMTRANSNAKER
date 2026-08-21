"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { gallerySchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function createGallery(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, gallerySchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.gallery.create({
      data: {
        title: data.title,
        description: data.description ?? null,
        category: data.category ?? null,
        imageUrl: data.imageUrl,
        order: data.order,
        status: data.status,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function updateGallery(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, gallerySchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.gallery.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description ?? null,
        category: data.category ?? null,
        imageUrl: data.imageUrl,
        order: data.order,
        status: data.status,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteGallery(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.gallery.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

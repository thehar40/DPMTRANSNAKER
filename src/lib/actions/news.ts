"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { newsSchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function createNews(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, newsSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? new Date()
        : (data.publishedAt ?? null);
    await prisma.news.create({
      data: {
        divisionId: data.divisionId ?? null,
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage ?? null,
        status: data.status,
        publishedAt,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function updateNews(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, newsSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    const existing = await prisma.news.findUnique({ where: { id } });
    const publishedAt =
      data.status === "published" && !data.publishedAt
        ? (existing?.publishedAt ?? new Date())
        : (data.publishedAt ?? null);
    await prisma.news.update({
      where: { id },
      data: {
        divisionId: data.divisionId ?? null,
        title: data.title,
        slug: data.slug,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage ?? null,
        status: data.status,
        publishedAt,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteNews(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.news.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { divisionSchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function createDivision(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, divisionSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.division.create({
      data: {
        name: data.name,
        slug: data.slug,
        abbreviation: data.abbreviation ?? null,
        description: data.description,
        duties: data.duties ?? null,
        icon: data.icon ?? null,
        order: data.order,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function updateDivision(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, divisionSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.division.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        abbreviation: data.abbreviation ?? null,
        description: data.description,
        duties: data.duties ?? null,
        icon: data.icon ?? null,
        order: data.order,
      },
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteDivision(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.division.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

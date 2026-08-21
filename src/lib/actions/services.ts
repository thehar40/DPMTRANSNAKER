"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { serviceSchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function createService(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, serviceSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.service.create({
      data: {
        divisionId: data.divisionId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        requirements: data.requirements ?? null,
        procedures: data.procedures ?? null,
        externalUrl: data.externalUrl ?? null,
        externalButtonLabel: data.externalButtonLabel ?? null,
        icon: data.icon ?? null,
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

export async function updateService(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, serviceSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.service.update({
      where: { id },
      data: {
        divisionId: data.divisionId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        requirements: data.requirements ?? null,
        procedures: data.procedures ?? null,
        externalUrl: data.externalUrl ?? null,
        externalButtonLabel: data.externalButtonLabel ?? null,
        icon: data.icon ?? null,
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

export async function deleteService(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { contactSchema } from "@/lib/validation";
import {
  getId,
  guardAdmin,
  handleActionError,
  parseForm,
  type ActionResult,
} from "./helpers";

export async function createContact(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const { data, error } = parseForm(formData, contactSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.contactPerson.create({
      data: {
        divisionId: data.divisionId,
        name: data.name,
        position: data.position,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email ?? null,
        photo: data.photo ?? null,
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

export async function updateContact(formData: FormData): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = getId(formData);
  if (!id) return { ok: false, error: "Data tidak valid." };

  const { data, error } = parseForm(formData, contactSchema);
  if (error || !data) return { ok: false, error: error ?? "Data tidak valid." };

  try {
    await prisma.contactPerson.update({
      where: { id },
      data: {
        divisionId: data.divisionId,
        name: data.name,
        position: data.position,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email ?? null,
        photo: data.photo ?? null,
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

export async function deleteContact(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.contactPerson.delete({ where: { id } });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

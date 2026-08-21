"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  guardAdmin,
  handleActionError,
  type ActionResult,
} from "./helpers";

const INQUIRY_STATUSES = ["new", "read", "done"];

export async function updateInquiryStatus(
  formData: FormData
): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isFinite(id) || id <= 0 || !INQUIRY_STATUSES.includes(status)) {
    return { ok: false, error: "Data tidak valid." };
  }

  try {
    await prisma.inquiry.update({ where: { id }, data: { status } });
    revalidatePath("/admin/inquiries");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteInquiry(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.inquiry.delete({ where: { id } });
    revalidatePath("/admin/inquiries");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

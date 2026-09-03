"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  guardAdmin,
  handleActionError,
  type ActionResult,
} from "./helpers";

const FEEDBACK_STATUSES = ["new", "read", "done"];

export async function updateFeedbackStatus(
  formData: FormData
): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isFinite(id) || id <= 0 || !FEEDBACK_STATUSES.includes(status)) {
    return { ok: false, error: "Data tidak valid." };
  }

  try {
    await prisma.feedback.update({ where: { id }, data: { status } });
    revalidatePath("/admin/feedbacks");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function deleteFeedback(id: number): Promise<ActionResult> {
  const guard = await guardAdmin();
  if (guard) return guard;

  try {
    await prisma.feedback.delete({ where: { id } });
    revalidatePath("/admin/feedbacks");
    return { ok: true };
  } catch (e) {
    return handleActionError(e);
  }
}

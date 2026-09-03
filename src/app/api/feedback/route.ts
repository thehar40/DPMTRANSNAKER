import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { feedbackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Data tidak valid." },
        { status: 400 }
      );
    }

    await prisma.feedback.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email ?? null,
        rating: parsed.data.rating ?? null,
        message: parsed.data.message,
        status: "new",
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

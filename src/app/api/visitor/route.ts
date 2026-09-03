import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const current = await prisma.siteStat.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, totalVisits: 0, todayVisits: 0, lastReset: startOfToday },
    });

    const lastReset = current.lastReset ?? startOfToday;
    let totalVisits = current.totalVisits + 1;
    let todayVisits: number;
    let newLastReset = lastReset;

    if (new Date(lastReset).getTime() < startOfToday.getTime()) {
      todayVisits = 1;
      newLastReset = startOfToday;
    } else {
      todayVisits = current.todayVisits + 1;
    }

    await prisma.siteStat.update({
      where: { id: 1 },
      data: { totalVisits, todayVisits, lastReset: newLastReset },
    });

    return NextResponse.json({ ok: true, totalVisits, todayVisits });
  } catch (error) {
    console.error("Visitor error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

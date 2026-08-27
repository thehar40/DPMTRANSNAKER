import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const keyword = `%${q}%`;

  try {
    const [news, services, tutorials, divisions] = await Promise.all([
      prisma.news.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { title: true, slug: true, excerpt: true },
        take: 5,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.service.findMany({
        where: {
          status: "active",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { name: true, slug: true, description: true },
        take: 5,
        orderBy: { order: "asc" },
      }),
      prisma.tutorial.findMany({
        where: {
          status: "published",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { title: true, slug: true, description: true },
        take: 5,
        orderBy: { publishedAt: "desc" },
      }),
      prisma.division.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        select: { name: true, slug: true, description: true },
        take: 3,
        orderBy: { order: "asc" },
      }),
    ]);

    const results = [
      ...news.map((n) => ({ type: "berita" as const, title: n.title, slug: n.slug, excerpt: n.excerpt })),
      ...services.map((s) => ({ type: "layanan" as const, title: s.name, slug: s.slug, excerpt: s.description })),
      ...tutorials.map((t) => ({ type: "tutorial" as const, title: t.title, slug: t.slug, excerpt: t.description ?? undefined })),
      ...divisions.map((d) => ({ type: "bidang" as const, title: d.name, slug: d.slug, excerpt: d.description ?? undefined })),
    ];

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}

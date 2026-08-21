import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS } from "@/lib/constants";

export async function getSettings() {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    return setting ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getProfile() {
  try {
    return await prisma.profile.findUnique({ where: { id: 1 } });
  } catch {
    return null;
  }
}

export async function getDivisions() {
  try {
    return await prisma.division.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: {
        _count: { select: { services: true, contacts: true } },
      },
    });
  } catch {
    return [];
  }
}

export async function getDivisionBySlug(slug: string) {
  try {
    return await prisma.division.findUnique({
      where: { slug },
      include: {
        services: {
          where: { status: "active" },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
        contacts: {
          where: { status: "active" },
          orderBy: [{ order: "asc" }, { id: "asc" }],
        },
        _count: { select: { services: true } },
      },
    });
  } catch {
    return null;
  }
}

export async function getActiveServices() {
  try {
    return await prisma.service.findMany({
      where: { status: "active" },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      include: { division: true },
    });
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    return await prisma.service.findUnique({
      where: { slug },
      include: {
        division: {
          include: {
            contacts: {
              where: { status: "active" },
              orderBy: [{ order: "asc" }, { id: "asc" }],
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getActiveContacts() {
  try {
    return await prisma.contactPerson.findMany({
      where: { status: "active" },
      orderBy: [{ division: { order: "asc" } }, { order: "asc" }, { id: "asc" }],
      include: { division: true },
    });
  } catch {
    return [];
  }
}

export interface NewsQueryOptions {
  take?: number;
  page?: number;
  pageSize?: number;
  divisionId?: number;
  category?: string;
  q?: string;
  excludeId?: number;
}

export async function getPublishedNews(options: NewsQueryOptions = {}) {
  try {
    const where: Record<string, unknown> = {
      status: "published",
      publishedAt: { not: null },
    };
    if (options.divisionId) where.divisionId = options.divisionId;
    if (options.category) where.category = options.category;
    if (options.q) {
      where.OR = [
        { title: { contains: options.q } },
        { excerpt: { contains: options.q } },
        { content: { contains: options.q } },
      ];
    }
    if (options.excludeId) where.id = { not: options.excludeId };

    const pageSize = options.take ?? options.pageSize ?? 100;
    const page = options.page ?? 1;
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        take: pageSize,
        skip,
        include: { division: true },
      }),
      prisma.news.count({ where }),
    ]);
    return { items, total };
  } catch {
    return { items: [], total: 0 };
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    return await prisma.news.findFirst({
      where: { slug, status: "published", publishedAt: { not: null } },
      include: { division: true },
    });
  } catch {
    return null;
  }
}

export async function getActiveGalleries() {
  try {
    return await prisma.gallery.findMany({
      where: { status: "active" },
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
  } catch {
    return [];
  }
}

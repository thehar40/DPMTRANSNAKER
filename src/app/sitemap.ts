import type { MetadataRoute } from "next";
import {
  getActiveServices,
  getDivisions,
  getPublishedNews,
} from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const lastModified = new Date();

  const staticRoutes = [
    "",
    "/profil",
    "/bidang",
    "/layanan",
    "/berita",
    "/galeri",
    "/kontak",
    "/kebijakan-privasi",
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const divisions = await getDivisions();
  for (const division of divisions) {
    entries.push({
      url: `${siteUrl}/bidang/${division.slug}`,
      lastModified: division.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  const services = await getActiveServices();
  for (const service of services) {
    entries.push({
      url: `${siteUrl}/layanan/${service.slug}`,
      lastModified: service.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  const news = await getPublishedNews({ pageSize: 200 });
  for (const item of news.items) {
    entries.push({
      url: `${siteUrl}/berita/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return entries;
}

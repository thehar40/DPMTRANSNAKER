import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ClipboardList,
  Image,
  MessageSquare,
  Newspaper,
  PlayCircle,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getStats() {
  try {
    const [divisions, services, contacts, news, tutorials, galleries, inquiries] =
      await Promise.all([
        prisma.division.count(),
        prisma.service.count(),
        prisma.contactPerson.count(),
        prisma.news.count(),
        prisma.tutorial.count(),
        prisma.gallery.count(),
        prisma.inquiry.count(),
      ]);
    return { divisions, services, contacts, news, tutorials, galleries, inquiries };
  } catch {
    return {
      divisions: 0,
      services: 0,
      contacts: 0,
      news: 0,
      tutorials: 0,
      galleries: 0,
      inquiries: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const [latestInquiries, latestNews] = await Promise.all([
    prisma.inquiry
      .findMany({ orderBy: { createdAt: "desc" }, take: 5 })
      .catch(() => []),
    prisma.news
      .findMany({
        orderBy: { updatedAt: "desc" },
        take: 5,
        include: { division: true },
      })
      .catch(() => []),
  ]);

  const statCards = [
    { label: "Bidang", value: stats.divisions, icon: Building2, href: "/admin/divisions", color: "bg-primary-50 text-primary-700" },
    { label: "Layanan", value: stats.services, icon: ClipboardList, href: "/admin/services", color: "bg-teal-50 text-teal-700" },
    { label: "Contact Person", value: stats.contacts, icon: Users, href: "/admin/contacts", color: "bg-blue-50 text-blue-700" },
    { label: "Berita", value: stats.news, icon: Newspaper, href: "/admin/news", color: "bg-amber-50 text-amber-700" },
    { label: "Tutorial", value: stats.tutorials, icon: PlayCircle, href: "/admin/tutorials", color: "bg-indigo-50 text-indigo-700" },
    { label: "Galeri", value: stats.galleries, icon: Image, href: "/admin/galleries", color: "bg-purple-50 text-purple-700" },
    { label: "Pertanyaan", value: stats.inquiries, icon: MessageSquare, href: "/admin/inquiries", color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="section-kicker">Overview</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">
          Ringkasan konten website Dinas Penanaman Modal, Transmigrasi dan
          Tenaga Kerja Kabupaten Aceh Utara.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card card-interactive flex items-center gap-4 p-5"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-bold text-slate-900">
              Pertanyaan Terbaru
            </h3>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestInquiries.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              Belum ada pertanyaan masuk.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestInquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {inquiry.subject}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {inquiry.name} &middot; {formatDate(inquiry.createdAt, "d MMM yyyy, HH:mm")}
                      </p>
                    </div>
                    <StatusBadge status={inquiry.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-sm font-bold text-slate-900">Berita Terbaru</h3>
            <Link
              href="/admin/news"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary-700 hover:text-primary-800"
            >
              Lihat Semua
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestNews.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">
              Belum ada berita.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestNews.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/news/${item.id}/edit`}
                    className="flex items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-slate-50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {item.category}
                        {item.division ? ` &middot; ${item.division.name}` : ""}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { NewsCard } from "@/components/public/news-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PaginationNav } from "@/components/ui/breadcrumb";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPublishedNews } from "@/lib/data";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description:
    "Berita dan pengumuman resmi Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

const PAGE_SIZE = 6;

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const category = sp.category ?? "";
  const page = Math.max(1, Number(sp.page) || 1);

  const { items, total } = await getPublishedNews({
    q: q || undefined,
    category: category || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `/berita?${query}` : "/berita";
  };

  const buildCategoryHref = (cat: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("category", cat);
    const query = params.toString();
    return query ? `/berita?${query}` : "/berita";
  };

  return (
    <div>
      <PageHeader
        title="Berita & Pengumuman"
        description="Informasi terbaru seputar kegiatan, pengumuman, dan layanan Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara."
        breadcrumbs={[{ label: "Berita" }]}
      />

      <section className="surface-grid mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <SectionHeading
            align="left"
            eyebrow="Pusat Informasi"
            title="Informasi terkini untuk masyarakat"
            description="Temukan berita, pengumuman, dan informasi layanan yang dipublikasikan oleh dinas."
          />
          <div className="card flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <a
              href={buildCategoryHref("")}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                category === ""
                  ? "bg-primary-700 text-white ring-primary-700"
                  : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
              )}
            >
              Semua
            </a>
            {NEWS_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={buildCategoryHref(cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
                  category === cat
                    ? "bg-primary-700 text-white ring-primary-700"
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                )}
              >
                {cat}
              </a>
            ))}
          </div>

          <form action="/berita" method="get" className="flex w-full min-w-0 gap-2 lg:max-w-sm">
            {category ? (
              <input type="hidden" name="category" value={category} />
            ) : null}
            <div className="relative flex-1 lg:w-72">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Cari berita..."
                aria-label="Cari berita"
                className="input !pl-9"
              />
            </div>
            <button type="submit" className="btn-primary">
              Cari
            </button>
          </form>
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title={q || category ? "Tidak ditemukan" : "Belum ada berita"}
            description={
              q || category
                ? "Tidak ada berita yang cocok dengan pencarian Anda. Coba kata kunci atau kategori lain."
                : "Berita dan pengumuman akan tampil di sini setelah dipublikasikan oleh admin."
            }
          />
        ) : (
          <>
            <p className="mb-5 text-sm text-slate-500">
              Menampilkan {items.length} dari {total} berita
              {category ? ` kategori ${category}` : ""}
              {q ? ` untuk pencarian "${q}"` : ""}.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
            <PaginationNav page={page} totalPages={totalPages} buildHref={buildHref} />
          </>
        )}
      </section>
    </div>
  );
}

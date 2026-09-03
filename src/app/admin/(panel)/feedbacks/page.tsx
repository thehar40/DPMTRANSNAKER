import type { Metadata } from "next";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/delete-button";
import { StatusBadge } from "@/components/admin/status-badge";
import { deleteFeedback, updateFeedbackStatus } from "@/lib/actions/feedbacks";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Feedback Masuk",
};

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "new", label: "Baru" },
  { value: "read", label: "Dibaca" },
  { value: "done", label: "Selesai" },
];

export default async function AdminFeedbacksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "";

  const feedbacks = await prisma.feedback
    .findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <p className="section-kicker">Umpan Balik</p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Feedback Masuk</h2>
        <p className="text-sm text-slate-500">
          Masukan pengunjung dari formulir feedback di bagian bawah website.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={
              filter.value
                ? `/admin/feedbacks?status=${filter.value}`
                : "/admin/feedbacks"
            }
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium ring-1 transition",
              status === filter.value
                ? "bg-primary-700 text-white ring-primary-700"
                : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Pengirim</th>
                <th className="px-4 py-3">Penilaian</th>
                <th className="px-4 py-3">Masukan</th>
                <th className="px-4 py-3">Masuk</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {feedbacks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    Belum ada feedback masuk.
                  </td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="transition hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">
                        {feedback.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {feedback.email ?? "-"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {feedback.rating ? (
                        <span className="inline-flex items-center gap-0.5 text-accent-500">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < feedback.rating!
                                  ? "fill-accent-400 text-accent-400"
                                  : "text-slate-200"
                              )}
                            />
                          ))}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-slate-600">
                        {feedback.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(feedback.createdAt, "d MMM yyyy, HH:mm")}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={feedback.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {feedback.status === "new" ? (
                          <form
                            action={async (fd: FormData) => {
                              "use server";
                              await updateFeedbackStatus(fd);
                            }}
                          >
                            <input type="hidden" name="id" value={feedback.id} />
                            <input type="hidden" name="status" value="read" />
                            <button
                              type="submit"
                              className="btn-icon"
                              aria-label="Tandai dibaca"
                              title="Tandai Dibaca"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </form>
                        ) : null}
                        <DeleteButton
                          id={feedback.id}
                          entityName="feedback"
                          onDelete={deleteFeedback}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

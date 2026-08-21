import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, Mail, MessageSquare, Phone, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  deleteInquiry,
  updateInquiryStatus,
} from "@/lib/actions/inquiries";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Pertanyaan",
};

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await prisma.inquiry
    .findUnique({ where: { id: Number(id) } })
    .catch(() => null);

  if (!inquiry) notFound();

  const divisions = await prisma.division
    .findMany({ select: { id: true, name: true } })
    .catch(() => []);
  const division = divisions.find((d) => d.id === inquiry.divisionId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href="/admin/inquiries"
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Pertanyaan
          </Link>
          <h2 className="text-lg font-bold text-slate-900">
            Detail Pertanyaan
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {inquiry.status === "new" ? (
            <form
              action={async (fd: FormData) => {
                "use server";
                await updateInquiryStatus(fd);
              }}
            >
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="read" />
              <button type="submit" className="btn-secondary">
                Tandai Dibaca
              </button>
            </form>
          ) : null}
          {inquiry.status !== "done" ? (
            <form
              action={async (fd: FormData) => {
                "use server";
                await updateInquiryStatus(fd);
              }}
            >
              <input type="hidden" name="id" value={inquiry.id} />
              <input type="hidden" name="status" value="done" />
              <button type="submit" className="btn-primary">
                <CheckCircle2 className="h-4 w-4" />
                Tandai Selesai
              </button>
            </form>
          ) : null}
          <DeleteButton
            id={inquiry.id}
            entityName="pertanyaan"
            onDelete={deleteInquiry}
            iconOnly={false}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card space-y-5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-slate-900">
              {inquiry.subject}
            </h3>
            <StatusBadge status={inquiry.status} />
          </div>
          <p className="text-xs text-slate-400">
            Diterima {formatDate(inquiry.createdAt, "EEEE, d MMMM yyyy, HH:mm")}
          </p>
          <div className="rounded-xl bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">
            {inquiry.message}
          </div>
        </div>

        <div className="card h-fit space-y-4 p-6">
          <h3 className="text-sm font-bold text-slate-900">Informasi Pengirim</h3>
          <p className="flex items-start gap-2.5 text-sm text-slate-700">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            {inquiry.name}
          </p>
          {inquiry.email ? (
            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-start gap-2.5 break-all text-sm text-slate-700 transition hover:text-primary-700"
            >
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
              {inquiry.email}
            </a>
          ) : null}
          {inquiry.phone ? (
            <p className="flex items-start gap-2.5 text-sm text-slate-700">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
              {inquiry.phone}
            </p>
          ) : null}
          <p className="flex items-start gap-2.5 text-sm text-slate-700">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
            {division?.name ?? "Tidak memilih bidang"}
          </p>
        </div>
      </div>
    </div>
  );
}

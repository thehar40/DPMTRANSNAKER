import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ContactForm } from "@/components/admin/forms/contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit Contact Person",
};

export default async function AdminEditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [contact, divisions] = await Promise.all([
    prisma.contactPerson.findUnique({ where: { id: Number(id) } }).catch(() => null),
    prisma.division
      .findMany({
        orderBy: [{ order: "asc" }, { id: "asc" }],
        select: { id: true, name: true },
      })
      .catch(() => []),
  ]);

  if (!contact) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/contacts"
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Contact Person
        </Link>
        <h2 className="text-lg font-bold text-slate-900">
          Edit Contact Person
        </h2>
        <p className="text-sm text-slate-500">{contact.name}</p>
      </div>
      <ContactForm divisions={divisions} contact={contact} />
    </div>
  );
}

import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHeader } from "@/components/public/page-header";
import { ContactForm } from "@/components/public/contact-form";
import { ContactCard } from "@/components/public/contact-card";
import { MapPreview } from "@/components/public/map-preview";
import { EmptyState } from "@/components/ui/empty-state";
import { getActiveContacts, getDivisions, getSettings } from "@/lib/data";
import { getMapCoordinates } from "@/lib/map-coords";
import { hasValue } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara melalui formulir kontak, telepon, email, atau contact person bidang.",
};

export default async function ContactPage() {
  const [settings, divisions, contacts] = await Promise.all([
    getSettings(),
    getDivisions(),
    getActiveContacts(),
  ]);

  const contactGroups = divisions
    .map((division) => ({
      division,
      contacts: contacts.filter((c) => c.divisionId === division.id),
    }))
    .filter((group) => group.contacts.length > 0);

  const coordinates = await getMapCoordinates(settings.mapEmbedUrl);

  return (
    <div>
      <PageHeader
        title="Hubungi Kami"
        description="Sampaikan pertanyaan, saran, atau pengaduan Anda. Kami siap membantu dengan pelayanan yang profesional, transparan, dan akuntabel."
        breadcrumbs={[{ label: "Kontak" }]}
      />

      {/* Informasi kontak */}
      <section className="surface-grid mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card card-interactive p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-bold text-slate-900">Alamat</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {settings.address}
            </p>
          </div>
          <div className="card card-interactive p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
              <Phone className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-bold text-slate-900">Telepon</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {hasValue(settings.phone)
                ? settings.phone
                : "Nomor telepon belum diatur."}
            </p>
          </div>
          <div className="card card-interactive p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-bold text-slate-900">Email</h2>
            <p className="mt-1.5 break-all text-sm leading-relaxed text-slate-600">
              {hasValue(settings.email)
                ? settings.email
                : "Email belum diatur."}
            </p>
          </div>
          <div className="card card-interactive p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-sm font-bold text-slate-900">Jam Layanan</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              {settings.officeHours}
            </p>
          </div>
        </div>
      </section>

      {/* Peta + form */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Lokasi Kantor</h2>
            <p className="mt-2 text-sm text-slate-600">
              Kunjungi kantor kami pada jam layanan. Anda juga dapat melihat
              peta lokasi di bawah ini.
            </p>
            <div className="mt-5">
              <MapPreview
                url={settings.mapEmbedUrl}
                location={settings.address}
                coordinates={coordinates}
                heightClass="h-80"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Kirim Pesan kepada Kami
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Isi formulir di bawah ini. Pesan Anda akan masuk ke panel admin
              dan ditindaklanjuti petugas.
            </p>
            <div className="card mt-5 border-t-4 !border-t-primary-500 p-6 shadow-lg">
              <ContactForm
                divisions={divisions.map((d) => ({ id: d.id, name: d.name }))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact person per bidang */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <h2 className="text-xl font-bold text-slate-900">
          Contact Person per Bidang
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Hubungi langsung petugas bidang sesuai keperluan Anda.
        </p>

        {contactGroups.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title="Belum ada contact person"
              description="Kontak bidang akan tampil di sini setelah ditambahkan melalui panel admin."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {contactGroups.map((group) => (
              <div key={group.division.id}>
                <h3 className="mb-4 border-l-4 border-accent-500 pl-3 text-base font-bold text-slate-900">
                  {group.division.name}
                </h3>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.contacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      divisionName={group.division.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

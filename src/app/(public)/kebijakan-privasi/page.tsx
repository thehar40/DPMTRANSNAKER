import type { Metadata } from "next";
import { PageHeader } from "@/components/public/page-header";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi website Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        title="Kebijakan Privasi"
        description="Informasi tentang pengelolaan data pada website ini."
        breadcrumbs={[{ label: "Kebijakan Privasi" }]}
      />
      <section className="mx-auto max-w-3xl px-4 py-14">
        <div className="card space-y-6 p-6 text-sm leading-relaxed text-slate-600 sm:p-8">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              1. Informasi yang Dikumpulkan
            </h2>
            <p className="mt-2">
              Melalui formulir kontak, website ini mengumpulkan informasi yang
              Anda berikan secara sukarela, seperti nama, email, nomor
              WhatsApp, bidang tujuan, subjek, dan isi pesan. Kami tidak
              meminta password, OTP, atau data sensitif lainnya.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              2. Penggunaan Informasi
            </h2>
            <p className="mt-2">
              Informasi yang Anda sampaikan hanya digunakan untuk menindaklanjuti
              pertanyaan, permohonan layanan, atau pengaduan Anda oleh petugas
              dinas.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              3. Perlindungan Data
            </h2>
            <p className="mt-2">
              Data pesan Anda disimpan pada basis data aplikasi dan hanya dapat
              diakses oleh admin yang berwenang melalui panel admin.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              4. Tautan Eksternal
            </h2>
            <p className="mt-2">
              Website ini dapat menyediakan tautan ke situs pihak ketiga (OSS,
              Sincantik, Siapkerja, Siskop2mi, dan lainnya). Kebijakan privasi
              situs tersebut berlaku saat Anda mengaksesnya.
            </p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              5. Perubahan Kebijakan
            </h2>
            <p className="mt-2">
              Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan
              diumumkan melalui halaman ini.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

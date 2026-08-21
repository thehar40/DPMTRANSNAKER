import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Compass className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
      <p className="mt-2 text-lg font-semibold text-slate-700">
        Halaman tidak ditemukan
      </p>
      <p className="mt-1 max-w-md text-sm text-slate-500">
        Halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn-primary">
          Kembali ke Beranda
        </Link>
        <Link href="/kontak" className="btn-secondary">
          Hubungi Kami
        </Link>
      </div>
    </div>
  );
}

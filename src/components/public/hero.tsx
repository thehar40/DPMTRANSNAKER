import Link from "next/link";
import { ArrowRight, Building2, ClipboardList, PhoneCall, Quote } from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { SITE_TITLE } from "@/lib/constants";

interface HeroProps {
  tagline: string;
  divisionCount: number;
  serviceCount: number;
}

export function Hero({ tagline, divisionCount, serviceCount }: HeroProps) {
  return (
    <section className="hero-grid relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-10 hidden h-40 w-40 rounded-full border border-white/10 lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:py-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-accent-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-200">
            <ClipboardList className="h-3.5 w-3.5" />
            Situs Resmi Dinas Kabupaten Aceh Utara
          </p>
          <h1 className="text-balance text-2xl font-extrabold leading-tight sm:text-3xl lg:text-4xl">
            {SITE_TITLE}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Informasi layanan perizinan, penanaman modal, transmigrasi, hubungan
            industrial, dan pelatihan kerja.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/layanan" className="btn-primary !bg-accent-500 !py-2.5 !text-primary-950 hover:!bg-accent-400">
              Lihat Layanan
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/16"
            >
              <PhoneCall className="h-4 w-4" />
              Hubungi Kami
            </Link>
          </div>
          <div className="mt-4 grid max-w-md grid-cols-3 gap-3">
            {[
              { value: divisionCount, label: "Bidang & Unit" },
              { value: serviceCount, label: "Layanan" },
              { value: "5 Hari", label: "Layanan Per Minggu" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-center backdrop-blur"
              >
                <p className="text-xl font-extrabold text-accent-300">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="glass-panel animate-float-slow rounded-3xl p-8 shadow-2xl shadow-primary-950/20">
            <Logo
              showText={false}
              imageClassName="h-36 w-36 mx-auto"
              shortName=""
            />
            <div className="mt-6 rounded-2xl bg-white/10 p-5">
              <Quote className="h-6 w-6 text-accent-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium leading-relaxed text-white/90">
                {tagline}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-3 text-xs text-white/70">
              <Building2 className="h-4 w-4 text-accent-300" />
              <span>
                Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja
                <br />
                Kabupaten Aceh Utara
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative h-1.5 w-full bg-gradient-to-r from-transparent via-accent-400 to-transparent opacity-70"
      />
    </section>
  );
}

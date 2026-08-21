import Link from "next/link";
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { Logo } from "@/components/logo/logo";
import { getActiveServices, getSettings } from "@/lib/data";
import { hasValue } from "@/lib/utils";

const FOOTER_NAV = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/bidang", label: "Bidang & Layanan" },
  { href: "/layanan", label: "Layanan" },
  { href: "/berita", label: "Berita" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
  { href: "/kebijakan-privasi", label: "Kebijakan Privasi" },
];

export async function Footer() {
  const settings = await getSettings();
  const services = await getActiveServices();
  const year = new Date().getFullYear();

  const socials = [
    { key: "facebook", href: settings.facebook, icon: Facebook, label: "Facebook" },
    { key: "instagram", href: settings.instagram, icon: Instagram, label: "Instagram" },
    { key: "youtube", href: settings.youtube, icon: Youtube, label: "YouTube" },
  ].filter((s) => hasValue(s.href));

  return (
    <footer className="bg-primary-950 text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo
              light
              shortName={settings.shortName}
              subtitle="Kabupaten Aceh Utara"
              imageClassName="h-14 w-14"
            />
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              {settings.tagline}
            </p>
            {socials.length > 0 ? (
              <div className="mt-4 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.href as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-accent-500 hover:text-white"
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition hover:text-accent-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Layanan
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 8).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="text-white/70 transition hover:text-accent-300"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Kontak
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span className="text-white/70">{settings.address}</span>
              </li>
              {hasValue(settings.phone) ? (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  <span className="text-white/70">{settings.phone}</span>
                </li>
              ) : null}
              {hasValue(settings.email) ? (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-white/70 transition hover:text-accent-300"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span className="text-white/70">{settings.officeHours}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/50 sm:flex-row">
          <p>
            &copy; {year} {settings.agencyName}. Semua hak dilindungi.
          </p>
          <p>Melayani dengan Profesional, Transparan, dan Akuntabel</p>
        </div>
      </div>
    </footer>
  );
}

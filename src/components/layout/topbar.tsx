import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/data";
import { hasValue } from "@/lib/utils";

export async function Topbar() {
  const settings = await getSettings();

  const phoneHref = /^\d/.test(settings.phone)
    ? `tel:${settings.phone.replace(/[^+\d]/g, "")}`
    : "#";

  return (
    <div className="bg-primary-950 text-white/90 shadow-inner shadow-black/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-xs">
        <div className="flex min-w-0 items-center gap-4">
          <span className="hidden min-w-0 items-center gap-1.5 md:flex">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
            <span className="truncate">{settings.address}</span>
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <Clock className="h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
            {settings.officeHours}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {hasValue(settings.phone) ? (
            <a
              href={phoneHref}
              className="hidden items-center gap-1.5 transition hover:text-accent-300 sm:flex"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {settings.phone}
            </a>
          ) : null}
          {hasValue(settings.email) ? (
            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-1.5 transition hover:text-accent-300"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{settings.email}</span>
              <span className="sm:hidden">Email</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

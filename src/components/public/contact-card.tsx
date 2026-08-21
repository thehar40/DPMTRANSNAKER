import { Mail, MessageCircle, Phone, UserRound } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { buildWhatsAppLink, normalizePhoneNumber } from "@/lib/whatsapp";
import { cn, getInitials } from "@/lib/utils";

interface ContactCardProps {
  contact: {
    id: number;
    name: string;
    position: string;
    phone: string;
    whatsapp: string;
    email: string | null;
    photo: string | null;
  };
  divisionName?: string | null;
  compact?: boolean;
}

export function ContactCard({
  contact,
  divisionName,
  compact = false,
}: ContactCardProps) {
  const waLink = buildWhatsAppLink(
    contact.whatsapp,
    `Halo, saya ingin bertanya kepada ${contact.name} (${contact.position}).`
  );
  const hasWa = !!normalizePhoneNumber(contact.whatsapp);
  const telLink = /^\d/.test(contact.phone)
    ? `tel:${contact.phone.replace(/[^+\d]/g, "")}`
    : null;

  return (
    <article className={cn("card card-interactive flex h-full flex-col", compact ? "p-4" : "p-5")}>
      <div className="flex items-center gap-3.5">
        <div className="relative">
          {contact.photo ? (
            <SmartImage
              src={contact.photo}
              alt={`Foto ${contact.name}`}
              className="h-14 w-14 rounded-full ring-2 ring-primary-100"
              imgClassName="rounded-full"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-bold text-white ring-2 ring-primary-100">
              {getInitials(contact.name)}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {contact.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">
            {contact.position}
          </p>
          {divisionName ? (
            <p className="mt-0.5 truncate text-[11px] font-medium text-primary-600">
              {divisionName}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs text-slate-600">
        {contact.email ? (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 truncate transition hover:text-primary-700"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-primary-500" />
            <span className="truncate">{contact.email}</span>
          </a>
        ) : null}
        {contact.phone ? (
          <p className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0 text-primary-500" />
            {contact.phone}
          </p>
        ) : null}
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        {telLink ? (
          <a
            href={telLink}
            className="btn-secondary flex-1 !px-3 !py-1.5 text-xs"
          >
            <Phone className="h-3.5 w-3.5" />
            Telepon
          </a>
        ) : null}
        {hasWa ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400">
            <UserRound className="h-3.5 w-3.5" />
            Hubungi Kantor
          </span>
        )}
      </div>
    </article>
  );
}

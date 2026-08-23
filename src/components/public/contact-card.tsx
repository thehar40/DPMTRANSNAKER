import { Mail, MessageCircle, Phone } from "lucide-react";
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

  const avatar = contact.photo ? (
    <SmartImage
      src={contact.photo}
      alt={`Foto ${contact.name}`}
      className={cn(
        collectAvatarSize(compact),
        "rounded-full ring-2 ring-primary-100"
      )}
      imgClassName="rounded-full"
    />
  ) : (
    <div
      className={cn(
        collectAvatarSize(compact),
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-primary-800 font-bold text-white ring-2 ring-primary-100",
        compact ? "text-xs" : "text-sm"
      )}
    >
      {getInitials(contact.name)}
    </div>
  );

  if (compact) {
    return (
      <article className="card flex h-full items-center gap-3 p-3 transition hover:border-primary-100 hover:shadow-md">
        {avatar}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {contact.name}
          </h3>
          <p className="truncate text-xs text-slate-500">{contact.position}</p>
        </div>
        {hasWa ? (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${contact.name}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 transition hover:bg-green-500 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        ) : null}
      </article>
    );
  }

  return (
    <article className="card flex h-full flex-col p-4 transition hover:border-primary-100 hover:shadow-lg">
      <div className="flex items-center gap-3">
        {avatar}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {contact.name}
          </h3>
          <p className="truncate text-xs text-slate-500">{contact.position}</p>
          {divisionName ? (
            <p className="mt-0.5 truncate text-[11px] font-medium text-primary-600">
              {divisionName}
            </p>
          ) : null}
        </div>
      </div>

      {contact.email ? (
        <a
          href={`mailto:${contact.email}`}
          className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-primary-700"
        >
          <Mail className="h-3.5 w-3.5 shrink-0 text-primary-500" />
          <span className="truncate">{contact.email}</span>
        </a>
      ) : null}

      <div className="mt-auto flex items-center gap-2 pt-3">
        {telLink ? (
          <a
            href={telLink}
            className="btn-secondary flex-none !rounded-lg !px-2.5 !py-1.5 text-xs"
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
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-500 px-2.5 text-xs font-semibold text-white transition hover:bg-green-600"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
        ) : null}
      </div>
    </article>
  );
}

function collectAvatarSize(compact: boolean): string {
  return compact ? "h-11 w-11" : "h-12 w-12";
}

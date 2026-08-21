import {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Construction,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Megaphone,
  Plane,
  Scale,
  TrendingUp,
  Truck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  Briefcase,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Construction,
  FileText,
  Globe,
  GraduationCap,
  Handshake,
  Landmark,
  Megaphone,
  Plane,
  Scale,
  TrendingUp,
  Truck,
  Users,
};

export function getIcon(name?: string | null): LucideIcon {
  if (name && ICONS[name]) return ICONS[name];
  return Landmark;
}

interface IconBadgeProps {
  name?: string | null;
  className?: string;
  iconClassName?: string;
}

export function IconBadge({ name, className, iconClassName }: IconBadgeProps) {
  const Icon = getIcon(name);
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 ring-1 ring-primary-100",
        className
      )}
    >
      <Icon className={cn("h-6 w-6", iconClassName)} aria-hidden="true" />
    </div>
  );
}

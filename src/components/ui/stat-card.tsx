import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  description?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  value,
  label,
  description,
  className,
}: StatCardProps) {
  return (
    <div className={cn("card flex items-start gap-4 p-5", className)}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 ring-1 ring-primary-100">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-slate-700">{label}</p>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

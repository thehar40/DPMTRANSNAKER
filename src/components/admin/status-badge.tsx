import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  new: { label: "Baru", className: "bg-blue-50 text-blue-700 ring-blue-200" },
  read: { label: "Dibaca", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  done: { label: "Selesai", className: "bg-green-50 text-green-700 ring-green-200" },
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  published: { label: "Terbit", className: "bg-green-50 text-green-700 ring-green-200" },
  active: { label: "Aktif", className: "bg-green-50 text-green-700 ring-green-200" },
  inactive: { label: "Nonaktif", className: "bg-slate-100 text-slate-500 ring-slate-200" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}

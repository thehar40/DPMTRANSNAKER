"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Users } from "lucide-react";

export function VisitorStats({
  totalVisits,
  todayVisits,
}: {
  totalVisits: number;
  todayVisits: number;
}) {
  const [stats, setStats] = useState({ totalVisits, todayVisits });

  useEffect(() => {
    const key = "dpm_visit_counted";
    let counted = false;
    try {
      counted = !!sessionStorage.getItem(key);
    } catch {
      counted = false;
    }

    if (counted) return;

    fetch("/api/visitor", { method: "POST" })
      .then((response) => response.json().catch(() => ({})))
      .then((data) => {
        if (
          data &&
          typeof data.totalVisits === "number" &&
          typeof data.todayVisits === "number"
        ) {
          setStats({
            totalVisits: data.totalVisits,
            todayVisits: data.todayVisits,
          });
        }
      })
      .catch(() => {});

    try {
      sessionStorage.setItem(key, "1");
    } catch {
      /* abaikan */
    }
  }, []);

  return (
    <div>
      <p className="section-kicker !text-accent-300">Statistik Kunjungan</p>
      <h2 className="mt-2 text-xl font-bold text-white">Pengunjung Website</h2>
      <p className="mt-2 text-sm leading-relaxed text-white/70">
        Terima kasih telah mengunjungi website resmi Dinas Penanaman Modal,
        Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-400 text-primary-950">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white tabular-nums">
              {stats.totalVisits.toLocaleString("id-ID")}
            </p>
            <p className="text-xs font-medium text-white/60">
              Total Kunjungan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/80 text-white">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white tabular-nums">
              {stats.todayVisits.toLocaleString("id-ID")}
            </p>
            <p className="text-xs font-medium text-white/60">
              Kunjungan Hari Ini
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sparkles,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react";

interface InfoTickerProps {
  coordinates: { lat: number; lon: number } | null;
}

const WEATHER_MAP: Record<number, { label: string; icon: LucideIcon }> = {
  0: { label: "Cerah", icon: Sun },
  1: { label: "Cerah sedang berawan", icon: Sun },
  2: { label: "Sebagian berawan", icon: CloudSun },
  3: { label: "Berawan", icon: Cloud },
  45: { label: "Kabut", icon: CloudFog },
  48: { label: "Kabut berembun", icon: CloudFog },
  51: { label: "Gerimis ringan", icon: CloudDrizzle },
  53: { label: "Gerimis", icon: CloudDrizzle },
  55: { label: "Gerimis lebat", icon: CloudDrizzle },
  61: { label: "Hujan ringan", icon: CloudRain },
  63: { label: "Hujan sedang", icon: CloudRain },
  65: { label: "Hujan lebat", icon: CloudRain },
  66: { label: "Hujan beku", icon: CloudDrizzle },
  67: { label: "Hujan beku lebat", icon: CloudDrizzle },
  71: { label: "Salju ringan", icon: CloudSnow },
  73: { label: "Bersalju", icon: CloudSnow },
  75: { label: "Salju lebat", icon: CloudSnow },
  80: { label: "Hujan ringan", icon: CloudRain },
  81: { label: "Hujan sedang", icon: CloudRain },
  82: { label: "Hujan lebat", icon: CloudRain },
  85: { label: "Salju ringan", icon: CloudSnow },
  86: { label: "Salju lebat", icon: CloudSnow },
  95: { label: "Badai petir", icon: CloudLightning },
  96: { label: "Badai petir hujan es", icon: CloudLightning },
  99: { label: "Badai petir hujan es", icon: CloudLightning },
};

interface WeatherState {
  status: "idle" | "loading" | "ok" | "error";
  temperature?: number;
  code?: number;
  wind?: number;
}

export function InfoTicker({ coordinates }: InfoTickerProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [weather, setWeather] = useState<WeatherState>({ status: "idle" });

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!coordinates) {
      setWeather({ status: "idle" });
      return;
    }

    let cancelled = false;
    setWeather({ status: "loading" });

    const endpoint = new URL("https://api.open-meteo.com/v1/forecast");
    endpoint.searchParams.set("latitude", String(coordinates.lat));
    endpoint.searchParams.set("longitude", String(coordinates.lon));
    endpoint.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
    endpoint.searchParams.set("timezone", "Asia/Jakarta");

    fetch(endpoint.toString())
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const current = data?.current;
        if (!current) throw new Error("Data cuaca tidak tersedia.");
        setWeather({
          status: "ok",
          temperature: Math.round(current.temperature_2m),
          code: current.weather_code,
          wind: Math.round(current.wind_speed_10m),
        });
      })
      .catch(() => {
        if (!cancelled) setWeather({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [coordinates]);

  const timeText = now
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
        timeZone: "Asia/Jakarta",
      }).format(now)
    : "--:--:--";

  const dateText = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(now)
    : "";

  const weatherInfo =
    weather.status === "ok" && weather.code !== undefined
      ? WEATHER_MAP[weather.code] ?? { label: "Berawan", icon: Cloud }
      : null;
  const temperature = weather.status === "ok" ? (weather.temperature ?? 0) : 0;
  const wind = weather.status === "ok" ? (weather.wind ?? 0) : 0;

  const TickerItem = ({ hidden = false }: { hidden?: boolean }) => (
    <div className="flex shrink-0 items-center gap-8" aria-hidden={hidden || undefined}>
      <span className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold tabular-nums">
        <Clock3 className="h-4 w-4 text-accent-300" />
        {timeText} WIB
      </span>
      <span className="flex items-center gap-2 whitespace-nowrap text-sm">
        <CalendarDays className="h-4 w-4 text-accent-300" />
        {dateText}
      </span>
      {weatherInfo ? (
        <span className="flex items-center gap-2 whitespace-nowrap text-sm">
          <weatherInfo.icon className="h-4 w-4 text-accent-300" />
          {temperature}&deg;C &middot; {weatherInfo.label}
          <Wind className="h-4 w-4 text-primary-300" />
          {wind} km/jam
        </span>
      ) : weather.status === "error" ? (
        <span className="flex items-center gap-2 whitespace-nowrap text-sm text-white/60">
          Perkiraan cuaca tidak dapat diambil saat ini
        </span>
      ) : null}
      <span className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-accent-200">
        <Sparkles className="h-4 w-4" />
        Melayani dengan Profesional, Transparan, dan Akuntabel
      </span>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400/60" />
    </div>
  );

  return (
    <div
      className="relative overflow-hidden border-b border-white/10 bg-primary-950 text-white"
      aria-label="Jam, tanggal, dan perkiraan cuaca saat ini"
    >
      <div className="animate-marquee flex w-max items-center gap-8 py-2.5 pr-8 hover:[animation-play-state:paused]">
        <TickerItem />
        <TickerItem hidden />
      </div>
    </div>
  );
}

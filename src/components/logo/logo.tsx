"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
  showText?: boolean;
  shortName?: string;
  subtitle?: string;
  light?: boolean;
}

export function Logo({
  className,
  imageClassName,
  textClassName,
  showText = true,
  shortName = "SI PEUMUDAH",
  subtitle = "Sistem Informasi Pelayanan dan Edukasi Mudah",
  light = false,
}: LogoProps) {
  const [src, setSrc] = useState("/logo-aceh-utara.png");

  const isSiPeumudah = shortName.toUpperCase().includes("SI PEUMUDAH");

  return (
    <div className={cn("flex items-center gap-2.5 sm:gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Logo Kabupaten Aceh Utara"
        className={cn(
          "h-10 w-10 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105 sm:h-11 sm:w-11",
          imageClassName
        )}
        onError={() => setSrc("/logo-aceh-utara.svg")}
      />
      {showText ? (
        <div className={cn("min-w-0 leading-tight", textClassName)}>
          <div className="flex items-center gap-1.5">
            {isSiPeumudah ? (
              <p
                className={cn(
                  "text-sm font-black tracking-tight sm:text-base",
                  light
                    ? "text-white"
                    : "bg-gradient-to-r from-primary-950 via-primary-800 to-teal-700 bg-clip-text text-transparent"
                )}
              >
                <span className={light ? "text-accent-300" : "text-amber-600 font-extrabold"}>SI</span>{" "}
                <span>PEUMUDAH</span>
              </p>
            ) : (
              <p
                className={cn(
                  "text-sm font-extrabold tracking-wide sm:text-base",
                  light ? "text-white" : "text-primary-900"
                )}
              >
                {shortName}
              </p>
            )}
          </div>
          <p
            className={cn(
              "text-[10px] font-medium tracking-tight sm:text-[11px]",
              light ? "text-white/80" : "text-slate-500 font-semibold"
            )}
            title={subtitle}
          >
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}

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
  shortName = "DPMTRANSNAKER",
  subtitle = "Kabupaten Aceh Utara",
  light = false,
}: LogoProps) {
  const [src, setSrc] = useState("/logo-aceh-utara.png");

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Logo Dinas Penanaman Modal, Transmigrasi dan Tenaga Kerja Kabupaten Aceh Utara"
        className={cn(
          "h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12",
          imageClassName
        )}
        onError={() => setSrc("/logo-aceh-utara.svg")}
      />
      {showText ? (
        <div className={cn("leading-tight", textClassName)}>
          <p
            className={cn(
              "text-sm font-extrabold tracking-wide sm:text-base",
              light ? "text-white" : "text-primary-900"
            )}
          >
            {shortName}
          </p>
          <p
            className={cn(
              "text-[11px] sm:text-xs",
              light ? "text-white/75" : "text-slate-500"
            )}
          >
            {subtitle}
          </p>
        </div>
      ) : null}
    </div>
  );
}

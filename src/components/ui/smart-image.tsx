"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  iconClassName?: string;
}

export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  iconClassName,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const show = !!src && src.trim() !== "" && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200",
        className
      )}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", imgClassName)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <ImageIcon
            className={cn("h-8 w-8 text-primary-400", iconClassName)}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

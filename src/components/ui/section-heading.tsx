import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-7 max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "mb-3 section-kicker",
            light && "!text-accent-300"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={cn(
          "text-balance text-2xl font-bold sm:text-3xl",
          light ? "text-white" : "text-slate-900"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-relaxed sm:text-base",
            light ? "text-white/80" : "text-slate-600"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

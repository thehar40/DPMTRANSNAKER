import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface LearningPathCardProps {
  number: string;
  title: string;
  description: string;
  href?: string;
}

export function LearningPathCard({
  number,
  title,
  description,
  href,
}: LearningPathCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-extrabold text-accent-300">{number}</span>
        <CheckCircle2 className="h-5 w-5 text-white/35" />
      </div>
      <h3 className="mt-4 text-sm font-bold text-white">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/60">
        {description}
      </p>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent-300">
          Buka panduan <ArrowRight className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-accent-400/50 hover:bg-white/10"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 opacity-75">
      {content}
    </div>
  );
}

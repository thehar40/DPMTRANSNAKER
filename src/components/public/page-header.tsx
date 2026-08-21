import Link from "next/link";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <section className="page-header-grid relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-400/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <Breadcrumb items={breadcrumbs} light />
        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      <div
        aria-hidden="true"
        className="relative h-1.5 w-full bg-gradient-to-r from-transparent via-accent-400 to-transparent opacity-70"
      />
    </section>
  );
}

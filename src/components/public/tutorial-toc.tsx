import Link from "next/link";
import { ListTree } from "lucide-react";
import { extractMarkdownHeadings } from "@/lib/utils";

export function TutorialToc({ content }: { content: string | null }) {
  const headings = extractMarkdownHeadings(content);
  if (headings.length === 0) return null;

  return (
    <nav className="card p-5" aria-label="Daftar isi tutorial">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
          <ListTree className="h-5 w-5" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">Daftar Isi</h2>
      </div>
      <ol className="mt-4 space-y-2 border-l border-slate-200 pl-4">
        {headings.map((heading) => (
          <li key={heading.id}>
            <Link
              href={`#${heading.id}`}
              className={`block text-sm leading-relaxed text-slate-500 transition hover:text-primary-700 ${
                heading.level === 3 ? "pl-3 text-xs" : "font-medium"
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

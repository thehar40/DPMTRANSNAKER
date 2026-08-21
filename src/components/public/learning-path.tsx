import { Route } from "lucide-react";
import { LearningPathCard } from "@/components/public/learning-path-card";

const PATH = [
  {
    number: "01",
    title: "Kenali layanan OSS",
    description: "Mulai dengan memahami persiapan perizinan usaha.",
    slug: "tutorial-perizinan-oss",
  },
  {
    number: "02",
    title: "Siapkan pelaporan investasi",
    description: "Pelajari data yang dibutuhkan untuk pelaporan kegiatan.",
    slug: "tutorial-pelaporan-lkpm-online",
  },
  {
    number: "03",
    title: "Ikuti panduan LKPM Online",
    description: "Pahami alur pengisian dan pengiriman LKPM.",
    slug: "tutorial-pelaporan-lkpm-online",
  },
  {
    number: "04",
    title: "Siapkan dokumen pencari kerja",
    description: "Lanjutkan dengan panduan pembuatan AK1 di Siapkerja.",
    slug: "tutorial-pembuatan-ak1-siapkerja",
  },
];

interface LearningPathProps {
  availableSlugs: string[];
}

export function LearningPath({ availableSlugs }: LearningPathProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary-950 p-6 text-white shadow-xl shadow-primary-950/10 sm:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-400 text-primary-950">
            <Route className="h-5 w-5" />
          </div>
          <div>
            <p className="section-kicker !text-accent-300">Learning Path</p>
            <h2 className="mt-2 text-xl font-bold sm:text-2xl">
              Jalur belajar untuk pemula
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              Ikuti urutan panduan ini agar proses belajar layanan terasa lebih
              terarah.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-4">
          {PATH.map((step) => {
            const available = availableSlugs.includes(step.slug);
            return (
              <LearningPathCard
                key={`${step.number}-${step.title}`}
                number={step.number}
                title={step.title}
                description={step.description}
                href={available ? `/tutorial/${step.slug}` : undefined}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

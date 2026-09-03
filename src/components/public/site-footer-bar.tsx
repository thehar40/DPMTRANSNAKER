import { getSiteStats } from "@/lib/data";
import { FeedbackForm } from "@/components/public/feedback-form";
import { VisitorStats } from "@/components/public/visitor-stats";

export async function SiteFooterBar() {
  const stats = await getSiteStats();

  return (
    <section
      aria-label="Statistik pengunjung dan feedback"
      className="border-t border-white/10 bg-primary-950"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
        <VisitorStats
          totalVisits={stats.totalVisits}
          todayVisits={stats.todayVisits}
        />
        <FeedbackForm />
      </div>
    </section>
  );
}

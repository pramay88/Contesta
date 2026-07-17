import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PlatformMarquee } from "@/components/PlatformMarquee";
import { getPlatformOptions } from '@/lib/platforms';
import { getWithSWR, getContestsCacheKey } from '@/lib/cache';
import { fetchContestsData } from '@/app/api/contests/route';

export const dynamic = 'force-dynamic';

const PLATFORM_COUNT = getPlatformOptions('contest').length;

async function getHomeStats() {
  const { data: contests } = await getWithSWR(getContestsCacheKey(), () => fetchContestsData());

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayCount = contests.filter((contest) => {
    const start = new Date(contest.start);
    return start >= today && start < tomorrow;
  }).length;

  return {
    todayCount,
    totalServed: contests.length,
    totalTracked: PLATFORM_COUNT,
  };
}

export default async function Home() {
  const stats = await getHomeStats();

  return (
    <main className="bg-(--bg-page)">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-16 px-4 py-14 md:px-6 lg:py-20">

        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-card) px-3 py-1.5 font-mono text-xs font-medium text-(--text-secondary)">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-(--accent) opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--accent)" />
            </span>
            live across {stats.totalTracked} contest platforms
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-(--text-primary) md:text-6xl">
            Never miss a coding contest again.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-(--text-secondary) md:text-lg">
            Discover, track, and join coding contests from all major competitive programming platforms—all in one place.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contests"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--accent) px-5 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
            >
              See upcoming contests <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-(--border) px-5 py-3 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
            >
              How it works
            </Link>
          </div>
        </section>

        <PlatformMarquee />

        {/* Stats */}
        <section className="grid grid-cols-1 divide-y divide-(--border) overflow-hidden rounded-3xl border border-(--border) bg-(--bg-card) sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full motion-safe:animate-ping rounded-full bg-(--accent) opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-(--accent)" />
              </span>
              Today
            </div>
            <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-(--text-primary)">
              {stats.todayCount}
            </div>
            <div className="text-sm text-(--text-muted)">contests starting today</div>
          </div>

          <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">Feed</div>
            <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-(--text-primary)">
              {stats.totalServed}
            </div>
            <div className="text-sm text-(--text-muted)">contests in the current window</div>
          </div>

          <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-(--text-muted)">Coverage</div>
            <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight text-(--text-primary)">
              {stats.totalTracked}
            </div>
            <div className="text-sm text-(--text-muted)">platforms tracked</div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
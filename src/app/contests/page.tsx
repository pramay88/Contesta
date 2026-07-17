'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LayoutGrid, List, Maximize2, Minimize2, RefreshCw, Search } from 'lucide-react';
import { PlatformFilter } from '@/components/PlatformFilter';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
// import { ContestCard } from '@/components/ContestCard';
// import { SiteFooter } from '@/components/SiteFooter';
import { useContests } from './hooks/useContests';

type FilterType = 'all' | 'today' | 'week' | 'month';
type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'mixed' | 'unknown';
type ViewMode = 'calendar' | 'list' | 'both';

const DESKTOP_BREAKPOINT = 1024; // matches Tailwind's `lg`

export default function ContestsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [contestFilter, setContestFilter] = useState<FilterType>('all');
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all');
    const [mobileView, setMobileView] = useState<ViewMode>('both');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const {
        loading,
        isFetching,
        error,
        search,
        setSearch,
        selectedPlatforms,
        setSelectedPlatforms,
        upcomingContests,
        allCalendarEvents,
        refreshContests,
        refreshState,
    } = useContests(currentDate, difficultyFilter);

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const clicked = new Date(slotInfo.start); clicked.setHours(0, 0, 0, 0);
        setSelectedDate(prev => prev && prev.getTime() === clicked.getTime() ? null : clicked);
    };

    // 'both' is a desktop-only view — if the viewport shrinks below the lg
    // breakpoint while 'both' is active, fall back to a single-panel view so
    // mobile never renders the calendar and sidebar stacked together.
    useEffect(() => {
        const enforceMobileSingleView = () => {
            if (window.innerWidth < DESKTOP_BREAKPOINT && mobileView === 'both') {
                setMobileView('calendar');
            }
        };
        enforceMobileSingleView();
        window.addEventListener('resize', enforceMobileSingleView);
        return () => window.removeEventListener('resize', enforceMobileSingleView);
    }, [mobileView]);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    };

    const showCalendar = mobileView !== 'list';
    const showSidebar = mobileView !== 'calendar';
    const isBoth = mobileView === 'both';

    return (
        <main ref={containerRef} className="bg-(--bg-page)">
            <div className="mx-auto flex max-w-[1300px] flex-col gap-6 px-4 py-6 md:px-6 lg:py-8">
                <section className="overflow-hidden rounded-4xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="relative flex flex-wrap items-center justify-between gap-4 border-b p-5 pr-16 md:pr-5" style={{ borderColor: 'var(--border)' }}>
                        <div className="gap-2 flex flex-wrap items-center">
                            <button
                                type="button"
                                onClick={() => setMobileView('calendar')}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                                style={{ background: mobileView === 'calendar' ? 'var(--bg-card)' : 'transparent', color: mobileView === 'calendar' ? 'var(--text-primary)' : 'var(--text-muted)' }}
                                title="Calendar view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setMobileView('list')}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                                style={{ background: mobileView === 'list' ? 'var(--bg-card)' : 'transparent', color: mobileView === 'list' ? 'var(--text-primary)' : 'var(--text-muted)' }}
                                title="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>

                            {/* "Both" is desktop-only; hidden below the lg breakpoint */}
                            <button
                                type="button"
                                onClick={() => setMobileView('both')}
                                className="hidden items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors lg:inline-flex"
                                style={{ background: mobileView === 'both' ? 'var(--bg-card)' : 'transparent', color: mobileView === 'both' ? 'var(--text-primary)' : 'var(--text-muted)' }}
                                title="Show both"
                            >
                                <LayoutGrid className="h-4 w-4" />
                                <List className="h-4 w-4" />
                            </button>

                            <button
                                type="button"
                                onClick={toggleFullscreen}
                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
                                style={{ background: 'transparent', color: 'var(--text-muted)' }}
                                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                            >
                                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="flex w-full items-center gap-2 md:w-auto md:justify-end">
                            <label className="relative flex-1 md:flex-none">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    type="search"
                                    placeholder="Search contests..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="w-full rounded-full border px-10 py-2 text-sm outline-none transition-colors md:w-72"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                />
                            </label>

                            {/* Refresh Button — pinned to the top-right corner on mobile, inline with the search bar from md up */}
                            <button
                                onClick={refreshContests}
                                disabled={refreshState.isRefreshing || loading || isFetching}
                                className="absolute right-5 top-5 rounded-full border p-2 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 md:static"
                                style={{ background: 'var(--bg-card)', borderColor: refreshState.error ? '#ef4444' : 'var(--border)', color: refreshState.error ? '#ef4444' : 'var(--text-muted)' }}
                                title={refreshState.error ? refreshState.error : refreshState.lastRefreshed ? `Last refreshed: ${refreshState.lastRefreshed.toLocaleTimeString()}` : 'Refresh contests'}
                            >
                                <RefreshCw className={`h-4 w-4 ${refreshState.isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div
                        className={`grid gap-6 p-5 ${isBoth ? 'lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_388px]' : ''}`}
                    >
                        {showCalendar && (
                            <div className={`space-y-4 ${isBoth ? 'hidden lg:block' : ''}`}>
                                {mobileView === 'calendar' || isBoth ? (
                                    <ContestsCalendar
                                        events={allCalendarEvents}
                                        loading={loading}
                                        currentDate={currentDate}
                                        onNavigate={setCurrentDate}
                                        selectedDate={selectedDate}
                                        onSelectSlot={handleSelectSlot}
                                    />
                                ) : null}
                            </div>
                        )}

                        {showSidebar && (
                            <aside
                                className={
                                    isBoth
                                        ? 'sticky top-24 hidden h-[calc(100vh-7rem)] rounded-[28px] border p-4 lg:block'
                                        : 'rounded-[28px] border p-4 lg:mx-6'
                                }
                                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}
                            >
                                <ContestsSidebar
                                    upcomingContests={upcomingContests}
                                    loading={loading}
                                    error={error}
                                    currentFilter={contestFilter}
                                    onFilterChange={setContestFilter}
                                />
                            </aside>
                        )}
                    </div>
                </section>

                {/* <SiteFooter /> */}
            </div>

            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 p-4 lg:hidden">
                    <div className="mx-auto mt-16 max-w-lg rounded-[28px] border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-(--text-muted)">Filters</div>
                                <div className="text-base font-semibold text-(--text-primary)">Mobile filter drawer</div>
                            </div>
                            <button type="button" onClick={() => setMobileFiltersOpen(false)} className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: 'var(--border)' }}>
                                Close
                            </button>
                        </div>
                        <PlatformFilter
                            selectedPlatforms={selectedPlatforms}
                            onPlatformChange={setSelectedPlatforms}
                            difficultyFilter={difficultyFilter}
                            onDifficultyChange={setDifficultyFilter}
                            isLoading={loading || isFetching}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
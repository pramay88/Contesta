'use client';

import React, { useState } from 'react';
import { Header } from '@/components/header';
import { StatsHeader } from '@/components/StatsHeader';
import { PlatformFilter } from '@/components/PlatformFilter';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
import { useContests } from './hooks/useContests';
import { PLATFORM_OPTIONS } from './constants';

type FilterType = 'all' | 'today' | 'week' | 'month';

export default function ContestsPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [mobileView, setMobileView] = useState<'calendar' | 'list'>('calendar');
    const [contestFilter, setContestFilter] = useState<FilterType>('all');

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
    } = useContests(currentDate);

    const now = new Date();
    const todayCount = upcomingContests.filter(c => {
        const s = new Date(c.start);
        return s.getDate() === now.getDate() && s.getMonth() === now.getMonth() && s.getFullYear() === now.getFullYear();
    }).length;
    const weekEnd = new Date(); weekEnd.setDate(now.getDate() + 7);
    const weekCount = upcomingContests.filter(c => { const s = new Date(c.start); return s >= now && s <= weekEnd; }).length;
    const platformCount = PLATFORM_OPTIONS.length;

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const clicked = new Date(slotInfo.start); clicked.setHours(0, 0, 0, 0);
        setSelectedDate(prev => prev && prev.getTime() === clicked.getTime() ? null : clicked);
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>

            {/* ── Header ──────────────────────────────────────────── */}
            <Header
                search={search}
                onSearchChange={setSearch}
                mobileView={mobileView}
                onMobileViewChange={setMobileView}
            />

            {/* ── Main ────────────────────────────────────────────── */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-col gap-4">

                {/* Stats + Platform filter on same row */}
                <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                        <StatsHeader
                            todayCount={todayCount}
                            weekCount={weekCount}
                            upcomingCount={upcomingContests.length}
                            platformCount={platformCount}
                        />
                    </div>
                    <div className="flex-shrink-0 pt-0.5">
                        <PlatformFilter
                            selectedPlatforms={selectedPlatforms}
                            onPlatformChange={setSelectedPlatforms}
                            isLoading={loading || isFetching}
                        />
                    </div>
                </div>

                {/* Mobile search */}
                <div className="sm:hidden relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ color: 'var(--text-muted)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input type="text" placeholder="Search contests..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none"
                        style={{ fontFamily: 'var(--font-inter), sans-serif', background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                </div>

                {/* Desktop: Calendar + Sidebar */}
                <div className="hidden sm:grid sm:grid-cols-5 xl:grid-cols-3 gap-4">
                    <div className="sm:col-span-3 xl:col-span-2">
                        <ContestsCalendar
                            events={allCalendarEvents}
                            loading={loading}
                            currentDate={currentDate}
                            onNavigate={setCurrentDate}
                            selectedDate={selectedDate}
                            onSelectSlot={handleSelectSlot}
                        />
                    </div>
                    <div className="sm:col-span-2 xl:col-span-1 rounded-2xl p-4 flex flex-col"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', height: 'calc(100vh - 190px)', maxHeight: '740px' }}>
                        <ContestsSidebar
                            search={search}
                            onSearchChange={setSearch}
                            upcomingContests={upcomingContests}
                            loading={loading}
                            error={error}
                            currentFilter={contestFilter}
                            onFilterChange={setContestFilter}
                        />
                    </div>
                </div>

                {/* Mobile: Single view */}
                <div className="sm:hidden">
                    {mobileView === 'calendar' ? (
                        <ContestsCalendar
                            events={allCalendarEvents}
                            loading={loading}
                            currentDate={currentDate}
                            onNavigate={setCurrentDate}
                            selectedDate={selectedDate}
                            onSelectSlot={handleSelectSlot}
                        />
                    ) : (
                        <div className="rounded-2xl p-4"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minHeight: '60vh' }}>
                            <ContestsSidebar
                                search={search}
                                onSearchChange={setSearch}
                                upcomingContests={upcomingContests}
                                loading={loading}
                                error={error}
                                currentFilter={contestFilter}
                                onFilterChange={setContestFilter}
                            />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-8 pb-6 text-center">
                <p className="text-[11px]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                    Contesta.io — Built for competitive programmers ⚡
                </p>
            </footer>
        </div>
    );
}

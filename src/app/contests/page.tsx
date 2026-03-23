'use client';

import React, { useState } from 'react';
import { ContestaLogo } from '@/components/ContestaLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StatsHeader } from '@/components/StatsHeader';
import { PlatformFilter } from '@/components/PlatformFilter';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
import { useContests } from './hooks/useContests';
import { PLATFORM_OPTIONS } from './constants';
import { BsListUl, BsCalendar3 } from 'react-icons/bs';

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
            <header className="sticky top-0 z-40 backdrop-blur-md border-b"
                    style={{ background: 'var(--bg-header)', borderColor: 'var(--border)' }}>
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
                    {/* Single row: logo | spacer | search + theme | mobile toggles */}
                    <div className="flex items-center gap-3">
                        {/* Logo + name */}
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                            <ContestaLogo className="w-9 h-9" />
                            <div>
                                <h1 className="text-base font-bold leading-none"
                                    style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                                    Contesta<span style={{ color: 'var(--accent)' }}>.io</span>
                                </h1>
                                <p className="text-[10px] mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                                    All competitive programming contests, one place.
                                </p>
                            </div>
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Search + theme — exactly like reference image (search box | moon button) */}
                        <div className="hidden sm:flex items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                                     viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                     style={{ color: 'var(--text-muted)' }}>
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search contests..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-52 md:w-64 pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-all"
                                    style={{
                                        fontFamily: 'var(--font-inter), sans-serif',
                                        background: 'var(--bg-card)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                />
                            </div>
                            {/* Theme toggle — icon button right beside search */}
                            <ThemeToggle />
                        </div>

                        {/* Mobile: view toggles */}
                        <div className="flex sm:hidden items-center gap-1.5">
                            <ThemeToggle />
                            {(['calendar', 'list'] as const).map(v => (
                                <button key={v} onClick={() => setMobileView(v)}
                                    className="p-2 rounded-lg border"
                                    style={{
                                        background: mobileView === v ? 'var(--accent)' : 'var(--bg-card)',
                                        borderColor: mobileView === v ? 'var(--accent)' : 'var(--border)',
                                        color: mobileView === v ? '#fff' : 'var(--text-secondary)',
                                    }}>
                                    {v === 'calendar' ? <BsCalendar3 className="w-3.5 h-3.5" /> : <BsListUl className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

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

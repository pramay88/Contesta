import React, { useMemo } from 'react';
import { format } from 'date-fns';
import Badge from '@mui/material/Badge';
import type { Contest } from '@/app/contests/constants';
import { ContestCard } from './ContestCard';
import { SkeletonDateGroup } from './SkeletonLoaders';

type FilterType = 'all' | 'today' | 'week' | 'month';

interface ContestsSidebarProps {
    search: string;
    onSearchChange: (value: string) => void;
    upcomingContests: Contest[];
    loading: boolean;
    error: string;
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

const FILTERS: ReadonlyArray<{ key: FilterType; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
];

function getFilteredContests(contests: Contest[], filter: FilterType): Contest[] {
    const now = new Date();

    const startOfDay = (date: Date) => {
        const next = new Date(date);
        next.setHours(0, 0, 0, 0);
        return next;
    };

    const endOfDay = (date: Date) => {
        const next = new Date(date);
        next.setHours(23, 59, 59, 999);
        return next;
    };

    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return contests.filter((contest) => {
        if (filter === 'all') {
            return true;
        }

        const contestStart = new Date(contest.start);

        if (Number.isNaN(contestStart.getTime())) {
            return false;
        }

        if (filter === 'today') {
            return contestStart >= todayStart && contestStart <= todayEnd;
        }

        if (filter === 'week') {
            return contestStart <= weekEnd;
        }

        return contestStart <= monthEnd;
    });
}

export function ContestsSidebar({
    search,
    onSearchChange,
    upcomingContests,
    loading,
    error,
    currentFilter,
    onFilterChange,
}: ContestsSidebarProps) {
    const filteredContests = useMemo(() => getFilteredContests(upcomingContests, currentFilter), [upcomingContests, currentFilter]);

    // Counts for each filter tab, derived from the same filtering logic used
    // to build the visible list — this is the single source of truth for
    // both the displayed contests and the badge counts, so they can't drift.
    const filterCounts = useMemo(() => {
        return FILTERS.reduce((acc, filter) => {
            acc[filter.key] = getFilteredContests(upcomingContests, filter.key).length;
            return acc;
        }, {} as Record<FilterType, number>);
    }, [upcomingContests]);

    const groupedContests = useMemo(() => {
        const groups: Record<string, Contest[]> = {};

        filteredContests.forEach((contest) => {
            const key = format(new Date(contest.start), 'yyyy-MM-dd');
            if (!groups[key]) {
                groups[key] = [];
            }

            groups[key].push(contest);
        });

        return groups;
    }, [filteredContests]);

    return (
        <div className="flex h-full max-h-[80vh] flex-col gap-3">
            <h2 className="shrink-0 text-sm font-bold" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                Upcoming Contests
            </h2>

            <div className="flex flex-col gap-2 shrink-0 rounded-xl p-1" style={{ background: 'var(--border-subtle)' }}>
                <div className="flex gap-0.5">
                    {FILTERS.map((filter) => (
                        <Badge
                            key={filter.key}
                            className="flex-1"
                            badgeContent={filterCounts[filter.key]}
                            color="primary"
                            overlap="rectangular"
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <button
                                type="button"
                                onClick={() => onFilterChange(filter.key)}
                                className="w-full cursor-pointer rounded-lg py-1.5 text-[11px] font-semibold transition-all duration-150"
                                style={{
                                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                                    background: currentFilter === filter.key ? 'var(--bg-card)' : 'transparent',
                                    color: currentFilter === filter.key ? 'var(--text-primary)' : 'var(--text-muted)',
                                    boxShadow: currentFilter === filter.key ? 'var(--shadow-sm)' : 'none',
                                }}
                            >
                                {filter.label}
                            </button>
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
                {loading && (
                    <>
                        <SkeletonDateGroup />
                        <SkeletonDateGroup />
                    </>
                )}

                {!loading && error && (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                        <span className="text-2xl">⚠️</span>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</p>
                    </div>
                )}

                {!loading && !error && Object.keys(groupedContests).length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-10 text-center">
                        <span className="text-2xl">😌</span>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No contests here.</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {currentFilter !== 'all' ? 'Try a different time filter.' : 'Check back later.'}
                        </p>
                    </div>
                )}

                {!loading && Object.keys(groupedContests).sort().map((dateKey) => (
                    <section key={dateKey} className="mb-5">
                        <div className="mb-2.5 px-0.5 text-[12px] font-semibold" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {format(new Date(dateKey), 'MMMM d, yyyy')}
                        </div>
                        {groupedContests[dateKey].map((contest, index) => (
                            <ContestCard key={`${dateKey}-${index}`} contest={contest} variant="compact" />
                        ))}
                    </section>
                ))}
            </div>
        </div>
    );
}
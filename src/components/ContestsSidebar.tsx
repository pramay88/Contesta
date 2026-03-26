import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Contest } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';
import { ExternalLink, CalendarPlus } from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
    'leetcode.com': '#f89f1b',
    'codeforces.com': '#3b82f6',
    'codechef.com': '#ef6c35',
    'atcoder.jp': '#10b981',
    'hackerrank.com': '#22c55e',
    'hackerearth.com': '#6366f1',
    'geeksforgeeks.org': '#16a34a',
    'kaggle.com': '#06b6d4',
    'topcoder.com': '#ef4444',
    'interviewbit.com': '#8b5cf6',
    'codingninjas.com': '#f97316',
    'naukri.com/code360': '#9333ea',
};

const PLATFORM_LABELS: Record<string, string> = {
    'leetcode.com': 'LeetCode',
    'codeforces.com': 'Codeforces',
    'codechef.com': 'CodeChef',
    'atcoder.jp': 'AtCoder',
    'hackerrank.com': 'HackerRank',
    'hackerearth.com': 'HackerEarth',
    'geeksforgeeks.org': 'GFG',
    'kaggle.com': 'Kaggle',
    'topcoder.com': 'TopCoder',
    'interviewbit.com': 'InterviewBit',
    'codingninjas.com': 'CodeStudio',
    'naukri.com/code360': 'Code360',
};

function getTimeUntil(start: Date, end: Date): string {
    const now = Date.now();
    if (now > end.getTime()) return 'ENDED';
    const diff = start.getTime() - now;
    if (diff <= 0) return 'LIVE';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (d > 0) return `in ${d}d ${h}h`;
    if (h > 0) return `in ${h}h ${m}m`;
    return `in ${m}m`;
}

function formatDuration(start: Date, end: Date): string {
    const mins = Math.floor((end.getTime() - start.getTime()) / 60000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

function generateGCalUrl(contest: Contest): string {
    const s = new Date(contest.start);
    const e = new Date(contest.end);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.event)}&dates=${fmt(s)}/${fmt(e)}&location=${encodeURIComponent(contest.resource)}`;
}

function ContestCard({ contest }: { contest: Contest }) {
    const start = new Date(contest.start);
    const end = new Date(contest.end);
    const timeUntil = getTimeUntil(start, end);
    const isLive = timeUntil === 'LIVE';
    const isEnded = timeUntil === 'ENDED';
    const color = PLATFORM_COLORS[contest.resource] ?? '#6b7280';
    const label = PLATFORM_LABELS[contest.resource] ?? contest.resource.split('.')[0];

    return (
        <div className="rounded-xl p-4 mb-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {/* Row 1: badge + time-until + actions */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex items-center gap-1.5 pr-2.5 pl-1.5 py-1 rounded-full text-[11px] font-bold text-white flex-shrink-0"
                        style={{ background: color, fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                        <span style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px', flexShrink: 0 }}>
                            <PlatformIcon resource={contest.resource} className="w-2.5 h-2.5" />
                        </span>
                        {label}
                    </span>
                    {timeUntil && (
                        isLive ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-500"
                                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                                </span>
                                LIVE
                            </span>
                        ) : isEnded ? (
                            <span className="text-xs font-bold"
                                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#ef4444' }}>
                                Ended
                            </span>
                        ) : (
                            <span className="text-xs font-semibold"
                                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: '#10b981' }}>
                                {timeUntil}
                            </span>
                        )
                    )}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                    <a href={contest.href} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        title="Open contest">
                        <ExternalLink className="w-4 h-4" />
                    </a>
                    <a href={generateGCalUrl(contest)} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                        title="Add to calendar">
                        <CalendarPlus className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Row 2: name */}
            <h4 className="text-sm font-semibold leading-snug mb-2"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-inter), sans-serif' }}>
                {contest.event}
            </h4>

            {/* Row 3: date · time · duration */}
            <div className="flex items-center flex-wrap text-[12px] gap-x-3 gap-y-1"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-inter), sans-serif' }}>
                <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {format(start, 'MMM d')}
                </span>
                <span className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                    {format(start, 'hh:mm aa')}
                </span>
                <span>· Duration: {formatDuration(start, end)}</span>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return (
        <div className="rounded-xl p-4 mb-3 animate-pulse"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-2.5">
                <div className="h-6 w-24 rounded-full" style={{ background: 'var(--border)' }} />
                <div className="h-4 w-14 rounded" style={{ background: 'var(--border-subtle)' }} />
            </div>
            <div className="h-4 w-3/4 rounded mb-2" style={{ background: 'var(--border)' }} />
            <div className="h-3 w-1/2 rounded" style={{ background: 'var(--border-subtle)' }} />
        </div>
    );
}

// ─── Filter logic ─────────────────────────────────────────────
type FilterType = 'all' | 'today' | 'week' | 'month';

function getFilteredContests(contests: Contest[], filter: FilterType): Contest[] {
    const now = new Date();
    if (filter === 'all') return contests;

    const startOf = (d: Date) => { const c = new Date(d); c.setHours(0, 0, 0, 0); return c; };
    const endOf = (d: Date) => { const c = new Date(d); c.setHours(23, 59, 59, 999); return c; };

    const todayStart = startOf(now);
    const todayEnd = endOf(now);

    if (filter === 'today') {
        return contests.filter(c => {
            const s = new Date(c.start);
            return s >= todayStart && s <= todayEnd;
        });
    }
    if (filter === 'week') {
        const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 7);
        return contests.filter(c => new Date(c.start) <= weekEnd);
    }
    if (filter === 'month') {
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0); monthEnd.setHours(23, 59, 59, 999);
        return contests.filter(c => new Date(c.start) <= monthEnd);
    }
    return contests;
}

interface ContestsSidebarProps {
    search: string;
    onSearchChange: (v: string) => void;
    upcomingContests: Contest[];
    loading: boolean;
    error: string;
    currentFilter: FilterType;
    onFilterChange: (f: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
];

export function ContestsSidebar({
    search, onSearchChange, upcomingContests, loading, error, currentFilter, onFilterChange,
}: ContestsSidebarProps) {
    // Apply time-range filter on top of the already-upcoming list
    const filtered = useMemo(() => getFilteredContests(upcomingContests, currentFilter), [upcomingContests, currentFilter]);

    // Group by date key
    const grouped = useMemo(() => {
        const g: Record<string, Contest[]> = {};
        filtered.forEach(c => {
            const key = format(new Date(c.start), 'yyyy-MM-dd');
            if (!g[key]) g[key] = [];
            g[key].push(c);
        });
        return g;
    }, [filtered]);

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Title */}
            <h2 className="text-sm font-bold flex-shrink-0"
                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                Upcoming Contests
            </h2>

            {/* Filter tabs */}
            <div className="flex gap-0.5 flex-shrink-0 p-1 rounded-xl" style={{ background: 'var(--border-subtle)' }}>
                {FILTERS.map(f => (
                    <button key={f.key} onClick={() => onFilterChange(f.key)}
                        className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer"
                        style={{
                            fontFamily: 'var(--font-jetbrains-mono), monospace',
                            background: currentFilter === f.key ? 'var(--bg-card)' : 'transparent',
                            color: currentFilter === f.key ? 'var(--text-primary)' : 'var(--text-muted)',
                            boxShadow: currentFilter === f.key ? 'var(--shadow-sm)' : 'none',
                        }}>
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0">
                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ color: 'var(--text-muted)' }}>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input type="text" placeholder="Search contests..." value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border outline-none transition-all"
                    style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-primary)',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')} />
            </div>

            {/* List */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-0.5">
                {loading && <><SkeletonCard /><SkeletonCard /><SkeletonCard /></>}

                {!loading && error && (
                    <div className="flex flex-col items-center py-10 text-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</p>
                    </div>
                )}

                {!loading && !error && Object.keys(grouped).length === 0 && (
                    <div className="flex flex-col items-center py-10 text-center gap-2">
                        <span className="text-2xl">😌</span>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No contests here.</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {currentFilter !== 'all' ? 'Try a different time filter.' : 'Check back later.'}
                        </p>
                    </div>
                )}

                {!loading && Object.keys(grouped).sort().map(dateKey => (
                    <div key={dateKey} className="mb-5">
                        <div className="text-[12px] font-semibold mb-2.5 px-0.5"
                            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif' }}>
                            {format(new Date(dateKey), 'MMMM d, yyyy')}
                        </div>
                        {grouped[dateKey].map((c, i) => <ContestCard key={`${dateKey}-${i}`} contest={c} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}

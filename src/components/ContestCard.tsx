import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarPlus, Clock, ExternalLink } from 'lucide-react';
import type { Contest } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';
import { buildGoogleCalendarUrl, formatContestDuration, getContestPlatformMeta, getContestTimeLabel, getContestTimeState } from '@/lib/contest-utils';

interface ContestCardProps {
    contest: Contest;
    variant?: 'default' | 'compact';
}

const DIFFICULTY_STYLES: Record<string, { background: string; color: string }> = {
    beginner: { background: '#d1fae5', color: '#065f46' },
    intermediate: { background: '#fef3c7', color: '#92400e' },
    advanced: { background: '#fee2e2', color: '#991b1b' },
    mixed: { background: '#e5e7eb', color: '#374151' },
};

function DifficultyBadge({ difficulty }: { difficulty?: Contest['difficulty'] }) {
    if (!difficulty || difficulty === 'unknown') {
        return null;
    }

    const styles = DIFFICULTY_STYLES[difficulty] ?? DIFFICULTY_STYLES.mixed;

    return (
        <span className="rounded-full px-2 py-0.5 text-[10px]" style={styles}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>
    );
}

export function ContestCard({ contest, variant = 'default' }: ContestCardProps) {
    const [showCalendarMenu, setShowCalendarMenu] = useState(false);
    const start = new Date(contest.start);
    const end = new Date(contest.end);
    const platformMeta = getContestPlatformMeta(contest.resource);
    const timeLabel = getContestTimeLabel(start, end);
    const timeState = getContestTimeState(start, end);
    const calendarUrl = buildGoogleCalendarUrl({
        title: `[${platformMeta.label}] ${contest.event}`,
        start,
        end,
        details: `Contest link: ${contest.href}`,
        location: contest.href,
    });

    if (variant === 'compact') {
        return (
            <article className="mb-3 rounded-xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="mb-2.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: platformMeta.color, fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/90">
                                <PlatformIcon resource={contest.resource} className="h-2.5 w-2.5" />
                            </span>
                            {platformMeta.label}
                        </span>
                        {timeState === 'live' ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-500" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
                                </span>
                                LIVE
                            </span>
                        ) : (
                            <span className="text-xs font-semibold" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: timeState === 'ended' ? '#ef4444' : '#10b981' }}>
                                {timeLabel}
                            </span>
                        )}
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                        <a href={contest.href} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-(--text-muted) transition-colors hover:text-(--text-primary)" title="Open contest">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                        <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg p-1.5 text-(--text-muted) transition-colors hover:text-(--text-primary)" title="Add to calendar">
                            <CalendarPlus className="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <h4 className="mb-2 text-sm font-semibold leading-snug text-(--text-primary)" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    {contest.event}
                </h4>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-(--text-muted)" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                    <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {format(start, 'MMM d, h:mm aa')}
                    </span>
                    <span>· Duration: {formatContestDuration(start, end)}</span>
                    <DifficultyBadge difficulty={contest.difficulty} />
                </div>
            </article>
        );
    }

    return (
        <article className="rounded-xl border p-6 transition-shadow hover:shadow-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold text-white" style={{ background: platformMeta.color }}>
                        <PlatformIcon resource={contest.resource} className="h-2.5 w-2.5" />
                        {platformMeta.label}
                    </span>
                    {timeState === 'live' ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                            </span>
                            {timeLabel}
                        </span>
                    ) : (
                        <span className="text-xs text-(--text-muted)">{timeLabel}</span>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <a
                        href={contest.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg p-2 transition-colors hover:bg-(--bg-card-hover)"
                        title="Open contest"
                    >
                        <ExternalLink className="h-5 w-5 text-(--text-secondary)" />
                    </a>
                    <button
                        type="button"
                        onClick={() => setShowCalendarMenu((value) => !value)}
                        onBlur={() => setTimeout(() => setShowCalendarMenu(false), 150)}
                        className="rounded-lg p-2 transition-colors hover:bg-(--bg-card-hover)"
                        title="Add to calendar"
                    >
                        <CalendarPlus className="h-5 w-5 text-(--text-secondary)" />
                    </button>
                </div>
            </div>

            {showCalendarMenu && (
                <div className="mb-4 rounded-xl border bg-(--bg-card) p-2" style={{ borderColor: 'var(--border)' }}>
                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="block rounded-lg px-3 py-2 text-sm text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)">
                        Add to Google Calendar
                    </a>
                </div>
            )}

            <h3 className="mb-3 text-sm font-medium leading-tight text-(--text-primary)">
                {contest.event}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-sm text-(--text-secondary)">
                <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{format(start, 'MMM d')}</span>
                </span>
                <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{format(start, 'hh:mm aa')}</span>
                </span>
                <span>Duration: {formatContestDuration(start, end)}</span>
                <DifficultyBadge difficulty={contest.difficulty} />
            </div>
        </article>
    );
}
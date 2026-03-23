'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PlatformIcon } from './PlatformIcon';
import { format } from 'date-fns';
import { ExternalLink, CalendarPlus } from 'lucide-react';

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resource: string;
    url: string;
    bgColor: string;
}

interface CalendarViewProps {
    events: CalendarEvent[];
    loading: boolean;
    currentDate: Date;
    onNavigate: (date: Date) => void;
    selectedDate?: Date | null;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

const PLATFORM_DOT: Record<string, string> = {
    'leetcode.com': '#f89f1b',
    'codeforces.com': '#3b82f6',
    'codechef.com': '#7c3aed',
    'atcoder.jp': '#0ea5e9',
    'hackerrank.com': '#22c55e',
    'hackerearth.com': '#6366f1',
    'geeksforgeeks.org': '#16a34a',
    'kaggle.com': '#06b6d4',
    'topcoder.com': '#ef4444',
    'interviewbit.com': '#8b5cf6',
    'codingninjas.com': '#f97316',
};

function generateGCalUrl(ev: CalendarEvent): string {
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(ev.title)}&dates=${fmt(new Date(ev.start))}/${fmt(new Date(ev.end))}&location=${encodeURIComponent(ev.resource)}`;
}

// Day detail panel — shown in a fixed corner after clicking a day
function DayPanel({ events, date, onClose }: { events: CalendarEvent[]; date: Date; onClose: () => void }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        // Small delay so the click that opens the panel doesn't immediately close it
        const t = setTimeout(() => document.addEventListener('mousedown', handler), 50);
        return () => { clearTimeout(t); document.removeEventListener('mousedown', handler); };
    }, [onClose]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="fixed bottom-4 right-4 z-[9999] w-80 max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                 style={{ borderColor: 'var(--border)', background: 'var(--bg-card-hover)' }}>
                <div>
                    <div className="text-[11px] font-bold tracking-wider"
                         style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                        {format(date, 'EEEE').toUpperCase()}
                    </div>
                    <div className="text-sm font-bold"
                         style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                        {format(date, 'MMMM d, yyyy')}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent)', fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                        {events.length} contest{events.length !== 1 ? 's' : ''}
                    </span>
                    <button onClick={onClose} className="p-1 rounded-lg"
                            style={{ color: 'var(--text-muted)' }}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Contest list */}
            <div className="overflow-y-auto flex-1 divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {events.map(ev => {
                    const start = new Date(ev.start);
                    const end   = new Date(ev.end);
                    const mins  = Math.floor((end.getTime() - start.getTime()) / 60000);
                    const h = Math.floor(mins / 60); const m = mins % 60;
                    const duration = h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`;
                    const color = PLATFORM_DOT[ev.resource] ?? '#6b7280';

                    return (
                        <div key={ev.id} className="px-4 py-3"
                             style={{ background: 'var(--bg-card)' }}>
                            <div className="flex items-start gap-2.5">
                                <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5"
                                     style={{ background: color }} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <PlatformIcon resource={ev.resource} className="w-3 h-3 flex-shrink-0" />
                                        <span className="text-[10px] font-bold"
                                              style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color }}>
                                            {ev.resource.split('.')[0]}
                                        </span>
                                    </div>
                                    <p className="text-[13px] font-medium leading-snug mb-1"
                                       style={{ color: 'var(--text-primary)' }}>
                                        {ev.title}
                                    </p>
                                    <div className="text-[11px] flex items-center gap-2"
                                         style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                                        <span>{format(start, 'hh:mm a')}</span>
                                        <span>· {duration}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <a href={ev.url} target="_blank" rel="noopener noreferrer"
                                       className="p-1 rounded-lg"
                                       style={{ color: 'var(--text-muted)' }}
                                       onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                       onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                       title="Open">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <a href={generateGCalUrl(ev)} target="_blank" rel="noopener noreferrer"
                                       className="p-1 rounded-lg"
                                       style={{ color: 'var(--text-muted)' }}
                                       onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                                       onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                                       title="Add to Calendar">
                                        <CalendarPlus className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Max event rows to show per cell before "+N more"
const MAX_VISIBLE = 2;

export function ContestsCalendar({ events, loading, currentDate, onNavigate, selectedDate, onSelectSlot }: CalendarViewProps) {
    const [activeDayKey, setActiveDayKey] = useState<string | null>(null);
    const [activeDayEvents, setActiveDayEvents] = useState<CalendarEvent[]>([]);
    const [activeDayDate, setActiveDayDate] = useState<Date | null>(null);

    if (loading) {
        return (
            <div className="w-full rounded-2xl animate-pulse"
                 style={{ height: 480, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="h-6 w-40 rounded-lg" style={{ background: 'var(--border)' }} />
                </div>
                <div className="p-3 grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className="h-20 rounded-xl" style={{ background: 'var(--border-subtle)' }} />
                    ))}
                </div>
            </div>
        );
    }

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const gridStart = new Date(monthStart); gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(monthEnd); gridEnd.setDate(gridEnd.getDate() + (6 - monthEnd.getDay()));

    const days: Date[] = [];
    const cur = new Date(gridStart);
    while (cur <= gridEnd) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }

    const getEventsForDay = (date: Date) => {
        const s = new Date(date); s.setHours(0, 0, 0, 0);
        const e = new Date(date); e.setHours(23, 59, 59, 999);
        return events.filter(ev => { const es = new Date(ev.start); return es >= s && es <= e; });
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const isToday = (d: Date) => { const c = new Date(d); c.setHours(0, 0, 0, 0); return c.getTime() === today.getTime(); };
    const isSelected = (d: Date) => {
        if (!selectedDate) return false;
        const c = new Date(d); c.setHours(0, 0, 0, 0);
        const s = new Date(selectedDate); s.setHours(0, 0, 0, 0);
        return c.getTime() === s.getTime();
    };
    const isCurrentMonth = (d: Date) => d.getMonth() === currentDate.getMonth();

    const handleDayClick = (day: Date, dayEvs: CalendarEvent[]) => {
        const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;

        if (dayEvs.length > 0) {
            if (activeDayKey === dateKey) {
                // Toggle off
                setActiveDayKey(null);
                setActiveDayEvents([]);
                setActiveDayDate(null);
            } else {
                setActiveDayKey(dateKey);
                setActiveDayEvents(dayEvs);
                setActiveDayDate(new Date(day));
            }
        }

        // Also fire the slot selector for highlighting
        if (onSelectSlot) {
            onSelectSlot({
                start: new Date(new Date(day).setHours(0, 0, 0, 0)),
                end: new Date(new Date(day).setHours(23, 59, 59, 999)),
            });
        }
    };

    return (
        <>
            <div className="rounded-2xl overflow-hidden"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b"
                     style={{ borderColor: 'var(--border)' }}>
                    <h2 className="text-base font-bold"
                        style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                        {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-1">
                        {[
                            { label: 'Previous month', dir: -1 as const, Icon: ChevronLeft },
                            { label: 'Next month', dir: +1 as const, Icon: ChevronRight },
                        ].map(({ label, dir, Icon }) => (
                            <button key={dir}
                                onClick={() => onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() + dir))}
                                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--border-subtle)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                aria-label={label}>
                                <Icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-2">
                    {/* Day name headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAY_NAMES.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold py-1"
                                style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => {
                            const dayEvents = getEventsForDay(day);
                            const todayFlag = isToday(day);
                            const selected = isSelected(day);
                            const inMonth = isCurrentMonth(day);
                            const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                            const isActive = activeDayKey === dateKey;

                            const visible = dayEvents.slice(0, MAX_VISIBLE);
                            const overflow = dayEvents.length - MAX_VISIBLE;

                            return (
                                <div
                                    key={idx}
                                    onClick={() => handleDayClick(day, dayEvents)}
                                    className="min-h-[80px] sm:min-h-[90px] p-1.5 rounded-xl transition-all duration-100 select-none flex flex-col gap-0.5"
                                    style={{
                                        background: todayFlag ? 'var(--today-bg)' : isActive ? 'var(--accent-light)' : selected ? 'var(--accent-light)' : inMonth ? 'transparent' : 'var(--border-subtle)',
                                        border: todayFlag ? '2px solid var(--today-ring)' : isActive ? '2px solid var(--accent)' : selected ? '1.5px solid var(--accent)' : '1px solid var(--border-subtle)',
                                        cursor: dayEvents.length > 0 ? 'pointer' : 'default',
                                    }}
                                    onMouseEnter={e => {
                                        if (!todayFlag && !isActive && !selected && dayEvents.length > 0)
                                            e.currentTarget.style.background = 'var(--bg-card-hover)';
                                    }}
                                    onMouseLeave={e => {
                                        if (!todayFlag && !isActive && !selected)
                                            e.currentTarget.style.background = inMonth ? 'transparent' : 'var(--border-subtle)';
                                    }}
                                >
                                    {/* Date number */}
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full text-[11px] font-semibold self-start mb-0.5"
                                         style={{
                                             fontFamily: 'var(--font-jetbrains-mono), monospace',
                                             background: todayFlag ? 'var(--today-ring)' : 'transparent',
                                             color: todayFlag ? '#fff' : inMonth ? 'var(--text-primary)' : 'var(--text-muted)',
                                         }}>
                                        {day.getDate()}
                                    </div>

                                    {/* Event labels */}
                                    {visible.map(ev => {
                                        const color = PLATFORM_DOT[ev.resource] ?? '#6b7280';
                                        const shortName = ev.resource.split('.')[0];
                                        return (
                                            <div key={ev.id}
                                                 className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] truncate w-full"
                                                 style={{ background: `${color}22`, color }}>
                                                <PlatformIcon resource={ev.resource} className="w-2.5 h-2.5 flex-shrink-0" />
                                                <span className="truncate flex-1 leading-none" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                                                    {shortName} · {ev.title.split(' ').slice(0, 3).join(' ')}
                                                </span>
                                            </div>
                                        );
                                    })}

                                    {/* Overflow badge */}
                                    {overflow > 0 && (
                                        <div className="text-[10px] font-semibold px-1 mt-auto"
                                             style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--accent)' }}>
                                            +{overflow} more
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {!loading && events.length === 0 && (
                    <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                        No contests found for this month
                    </div>
                )}
            </div>

            {/* Day detail panel — fixed bottom-right corner */}
            {activeDayKey && activeDayDate && activeDayEvents.length > 0 && (
                <DayPanel
                    events={activeDayEvents}
                    date={activeDayDate}
                    onClose={() => { setActiveDayKey(null); setActiveDayEvents([]); setActiveDayDate(null); }}
                />
            )}
        </>
    );
}
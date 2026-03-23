interface StatsHeaderProps {
    todayCount: number;
    weekCount: number;
    upcomingCount: number;
    platformCount: number;
}

const STATS = [
    { key: 'platforms', label: 'Platforms',  color: '#8b5cf6' },
    { key: 'month',     label: 'This Month', color: '#0ea5e9' },
    { key: 'week',      label: 'This Week',  color: '#f97316' },
    { key: 'today',     label: 'Today',      color: '#eab308' },
] as const;

export function StatsHeader({ todayCount, weekCount, upcomingCount, platformCount }: StatsHeaderProps) {
    const values: Record<string, number> = {
        platforms: platformCount,
        month: upcomingCount,
        week: weekCount,
        today: todayCount,
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATS.map(s => (
                <div key={s.key}
                     className="flex items-baseline gap-2 px-3 py-2 rounded-xl border"
                     style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                    <span className="text-lg font-black leading-none"
                          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: s.color }}>
                        {values[s.key]}
                    </span>
                    <span className="text-[11px] font-medium truncate"
                          style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                        {s.label}
                    </span>
                </div>
            ))}
        </div>
    );
}

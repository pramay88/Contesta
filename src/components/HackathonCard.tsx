import { ExternalLink, CalendarDays, MapPin, Trophy, Users } from 'lucide-react';
import { PlatformIcon } from './PlatformIcon';
import { getPlatformColor, getPlatformLabel } from '@/lib/platforms';
import { formatHackathonDateRange, formatHackathonPrize, getHackathonStatusTone } from '@/lib/hackathons';
import type { Hackathon } from '@/app/hackathons/constants';

interface HackathonCardProps {
    hackathon: Hackathon;
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
    const statusTone = getHackathonStatusTone(hackathon.status);
    const platformColor = getPlatformColor(hackathon.platform);
    const platformLabel = getPlatformLabel(hackathon.platform);

    return (
        <article className="overflow-hidden rounded-2xl border bg-(--bg-card) shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
            {hackathon.thumbnail && (
                <div className="h-48 w-full bg-(--border-subtle)">
                    <img src={hackathon.thumbnail} alt={hackathon.title} className="h-full w-full object-cover" />
                </div>
            )}

            <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: platformColor }}>
                        <PlatformIcon resource={hackathon.platform} className="h-3 w-3" />
                        {platformLabel}
                    </span>
                    <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ background: statusTone.background, color: statusTone.color }}>
                        {hackathon.status}
                    </span>
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-(--text-primary)">
                    {hackathon.title}
                </h3>

                <p className="mb-4 text-sm text-(--text-secondary) line-clamp-3">
                    {hackathon.description ?? `Hosted by ${hackathon.organizer}`}
                </p>

                <div className="space-y-2 text-sm text-(--text-secondary)">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>{formatHackathonDateRange(hackathon.eventStart, hackathon.eventEnd)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="capitalize">{hackathon.type}</span>
                    </div>
                    {hackathon.totalPrize ? (
                        <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 shrink-0" />
                            <span className="font-semibold text-emerald-600">${formatHackathonPrize(hackathon.totalPrize)}</span>
                        </div>
                    ) : null}
                    {hackathon.participants ? (
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 shrink-0" />
                            <span>{new Intl.NumberFormat('en').format(hackathon.participants)} participants</span>
                        </div>
                    ) : null}
                </div>

                {hackathon.domains.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {hackathon.domains.slice(0, 3).map((domain) => (
                            <span key={domain} className="rounded-full bg-(--border-subtle) px-2 py-1 text-xs text-(--text-secondary)">
                                {domain}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="truncate text-xs text-(--text-muted)">{hackathon.organizer}</span>
                    <a
                        href={hackathon.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--bg-card-hover)"
                        style={{ border: '1px solid var(--border)' }}
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open
                    </a>
                </div>
            </div>
        </article>
    );
}

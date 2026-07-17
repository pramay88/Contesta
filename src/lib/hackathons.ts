import type { Hackathon, HackathonStatus, HackathonType } from '@/app/hackathons/constants';

export interface HackathonFilters {
    search: string;
    platform: Hackathon['platform'] | 'all';
    status: HackathonStatus | 'all';
    type: HackathonType | 'all';
}

function normalizeText(value: string): string {
    return value.trim().toLowerCase();
}

export function filterHackathons(hackathons: Hackathon[], filters: HackathonFilters): Hackathon[] {
    const search = normalizeText(filters.search);

    return hackathons.filter((hackathon) => {
        const searchableText = [
            hackathon.title,
            hackathon.organizer,
            hackathon.description ?? '',
            hackathon.platform,
            hackathon.type,
            hackathon.status,
            ...hackathon.domains,
            ...hackathon.skills,
        ]
            .join(' ')
            .toLowerCase();

        if (search && !searchableText.includes(search)) {
            return false;
        }

        if (filters.platform !== 'all' && hackathon.platform !== filters.platform) {
            return false;
        }

        if (filters.status !== 'all' && hackathon.status !== filters.status) {
            return false;
        }

        if (filters.type !== 'all' && hackathon.type !== filters.type) {
            return false;
        }

        return true;
    });
}

export function formatHackathonDateRange(startValue: string, endValue: string): string {
    const start = new Date(startValue);
    const end = new Date(endValue);

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
    }).format(start) + ` - ${new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
    }).format(end)}`;
}

export function formatHackathonPrize(value?: number): string {
    if (typeof value !== 'number') {
        return '';
    }

    return new Intl.NumberFormat('en', {
        maximumFractionDigits: 0,
    }).format(value);
}

export function getHackathonStatusTone(status: HackathonStatus): { background: string; color: string } {
    switch (status) {
        case 'live':
            return { background: '#dcfce7', color: '#15803d' };
        case 'upcoming':
            return { background: '#dbeafe', color: '#2563eb' };
        case 'closed':
            return { background: '#e5e7eb', color: '#374151' };
        case 'judging':
            return { background: '#fef3c7', color: '#b45309' };
        default:
            return { background: '#e5e7eb', color: '#374151' };
    }
}

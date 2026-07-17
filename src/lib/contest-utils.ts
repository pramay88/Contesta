import { getPlatformColor, getPlatformLabel } from './platforms';

export type ContestTimeState = 'upcoming' | 'live' | 'ended';

export interface ContestCalendarLinkInput {
    title: string;
    start: Date;
    end: Date;
    details?: string;
    location?: string;
}

export function formatCalendarDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildGoogleCalendarUrl({ title, start, end, details, location }: ContestCalendarLinkInput): string {
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${formatCalendarDate(start)}/${formatCalendarDate(end)}`,
        details: details ?? '',
        location: location ?? '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function formatContestDuration(start: Date, end: Date): string {
    const minutes = Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}m`;
    }

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
}

export function getContestTimeState(start: Date, end: Date, now = new Date()): ContestTimeState {
    if (now.getTime() > end.getTime()) {
        return 'ended';
    }

    if (start.getTime() <= now.getTime()) {
        return 'live';
    }

    return 'upcoming';
}

export function getContestTimeLabel(start: Date, end: Date, now = new Date()): string {
    const timeState = getContestTimeState(start, end, now);

    if (timeState === 'live') {
        return 'LIVE';
    }

    if (timeState === 'ended') {
        return 'Ended';
    }

    const diff = start.getTime() - now.getTime();
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (days > 0) {
        return `in ${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `in ${hours}h ${minutes}m`;
    }

    return `in ${minutes}m`;
}

export function getContestPlatformMeta(platformId: string) {
    return {
        label: getPlatformLabel(platformId),
        color: getPlatformColor(platformId),
    };
}

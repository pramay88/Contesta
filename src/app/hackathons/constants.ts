import { getPlatformIds, getPlatformOptions, type PlatformIdsForContext } from '@/lib/platforms';

export const HACKATHON_PLATFORMS = getPlatformIds('hackathon');

export type HackathonPlatform = PlatformIdsForContext<'hackathon'>;

export const PLATFORM_OPTIONS: ReadonlyArray<{ value: 'all' | HackathonPlatform; label: string }> = [
    { value: 'all', label: 'All Platforms' },
    ...getPlatformOptions('hackathon'),
];

export const STATUS_OPTIONS = [
    { value: 'all', label: 'All Status' },
    { value: 'live', label: 'Live' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'closed', label: 'Closed' },
];

export const TYPE_OPTIONS = [
    { value: 'all', label: 'All Types' },
    { value: 'online', label: 'Online' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'hybrid', label: 'Hybrid' },
];

export interface Hackathon {
    id: string;
    title: string;
    url: string;
    platform: HackathonPlatform;

    eventStart: string;
    eventEnd: string;
    registrationEnd?: string;

    status: HackathonStatus;
    type: HackathonType;
    isPaid: boolean;

    location?: {
        city?: string;
        country?: string;
    };

    organizer: string;
    domains: string[];
    skills: string[];

    totalPrize?: number;
    participants?: number;

    thumbnail?: string;
    description?: string;
}

export type HackathonStatus = 'upcoming' | 'live' | 'closed' | 'judging';
export type HackathonType = 'online' | 'in-person' | 'hybrid';

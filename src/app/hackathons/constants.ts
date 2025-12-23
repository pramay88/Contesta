// Hackathon constants and types

export const HACKATHON_PLATFORMS = [
    'devpost',
    'unstop',
    'kaggle',
] as const;

export type HackathonPlatform = typeof HACKATHON_PLATFORMS[number];

export const PLATFORM_OPTIONS = [
    { value: 'all', label: 'All Platforms' },
    { value: 'devpost', label: 'Devpost' },
    { value: 'unstop', label: 'Unstop' },
    { value: 'kaggle', label: 'Kaggle' },
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
    platform: 'devpost' | 'unstop' | 'kaggle';

    eventStart: string;
    eventEnd: string;
    registrationEnd?: string;

    status: 'upcoming' | 'live' | 'closed' | 'judging';
    type: 'online' | 'in-person' | 'hybrid';
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

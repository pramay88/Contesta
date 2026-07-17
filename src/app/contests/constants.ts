import { getPlatformIds, getPlatformOptions, normalizePlatformId, type PlatformIdsForContext } from '@/lib/platforms';

export const SUPPORTED_RESOURCES = getPlatformIds('contest');

export const PLATFORM_OPTIONS = getPlatformOptions('contest');

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed' | 'unknown';

export type DurationCategory = 'short' | 'medium' | 'long' | 'unknown';

export type DifficultyFilter = DifficultyLevel | 'all';
export type DurationFilter = DurationCategory | 'all';

export interface Contest {
    event: string;
    start: string;
    end: string;
    resource: string;
    href: string;
    status?: string;
    difficulty?: DifficultyLevel;
    durationMinutes?: number;
    durationCategory?: DurationCategory;
}

export type ContestPlatform = PlatformIdsForContext<'contest'>;

export function normalizeContestResource(resource: string): ContestPlatform | null {
    return normalizePlatformId(resource, 'contest') as ContestPlatform | null;
}
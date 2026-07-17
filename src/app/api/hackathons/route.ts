import { NextRequest, NextResponse } from 'next/server';
import { getWithSWR, getHackathonsCacheKey } from '@/lib/cache';
import { getPlatformOptions } from '@/lib/platforms';

interface Hackathon {
    id: string;
    title: string;
    url: string;
    platform: 'devpost' | 'unstop' | 'kaggle';
    eventStart: string;
    eventEnd: string;
    status: 'upcoming' | 'live' | 'closed' | 'judging';
    type: 'online' | 'in-person' | 'hybrid';
    isPaid: boolean;
    organizer: string;
    domains: string[];
    skills: string[];
    totalPrize?: number;
    participants?: number;
    thumbnail?: string;
}

const HACKATHON_PLATFORM_IDS = getPlatformOptions('hackathon').map((option) => option.value);

// Fetch from Unstop (local JSON) - disabled since file not in repo
async function fetchUnstopHackathons(): Promise<Hackathon[]> {
    // File not available in deployment
    return [];
}

// Core fetch logic (used by cache layer) - exported for refresh endpoint
export async function fetchHackathonsData(): Promise<Hackathon[]> {
    const [unstopHackathons] = await Promise.all([
        fetchUnstopHackathons(),
    ]);

    return unstopHackathons.filter((hackathon) => HACKATHON_PLATFORM_IDS.includes(hackathon.platform));
}

export async function GET(request: NextRequest) {
    try {
        // Use SWR caching strategy
        const cacheKey = getHackathonsCacheKey();
        const { data: hackathons, source, isStale } = await getWithSWR(
            cacheKey,
            fetchHackathonsData
        );

        return NextResponse.json(
            {
                hackathons,
                total: hackathons.length,
                cache: { source, isStale },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                    'Content-Type': 'application/json',
                    'X-Cache-Source': source,
                    'X-Cache-Stale': String(isStale),
                },
            }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hackathons', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

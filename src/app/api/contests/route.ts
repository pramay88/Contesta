import { NextRequest, NextResponse } from 'next/server';

const CLIST_API_USERNAME = process.env.CLIST_API_USERNAME || '';
const CLIST_API_KEY = process.env.CLIST_API_KEY || '';

// Request specific resources from Clist API
const CLIST_RESOURCE_IDS = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'atcoder.jp',
    'hackerrank.com',
    'hackerearth.com',
];

const CLIST_API_URL =
    `https://clist.by/api/v3/contest/?upcoming=true&order_by=start&limit=100&resource__in=${CLIST_RESOURCE_IDS.join(',')}`;

const SUPPORTED_RESOURCES = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'geeksforgeeks.org',
    'atcoder.jp',
    'hackerrank.com',
    'hackerearth.com',
    'interviewbit.com',
    'codingninjas.com',
];

interface Contest {
    event: string;
    start: string;
    end: string;
    resource: string;
    href: string;
    status?: string;
}

async function fetchClistContests(): Promise<Contest[]> {
    if (!CLIST_API_USERNAME || !CLIST_API_KEY) {
        console.error('CLIST API credentials are not set');
        return [];
    }

    try {
        const res = await fetch(CLIST_API_URL, {
            headers: {
                Authorization: `ApiKey ${CLIST_API_USERNAME}:${CLIST_API_KEY}`,
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) {
            console.error('Failed to fetch from clist.by:', res.statusText);
            return [];
        }

        const data = await res.json();
        console.log('Clist API returned:', data.objects?.length || 0, 'contests');

        // Log unique resources for debugging
        const uniqueResources = [...new Set(data.objects?.map((c: any) => c.resource) || [])];
        console.log('Unique resources from Clist:', uniqueResources.slice(0, 20));

        return (data.objects || []).map((c: any) => ({
            event: c.event || '',
            start: c.start || '',
            end: c.end || '',
            resource: c.resource || '',
            href: c.href || '',
        }));
    } catch (error) {
        console.error('Error fetching from clist.by:', error);
        return [];
    }
}

async function fetchGfgContests(): Promise<Contest[]> {
    try {
        const res = await fetch(
            'https://gfg-contests-api.vercel.app/api/gfg-contests',
            {
                next: { revalidate: 300 }, // Cache for 5 minutes
            }
        );

        if (!res.ok) {
            console.error('Failed to fetch from GFG API:', res.statusText);
            return [];
        }

        const raw = await res.json();
        const upcoming = raw?.results?.upcoming || [];
        const past = raw?.results?.past || [];

        console.log('GFG API returned:', upcoming.length + past.length, 'contests');

        return [...upcoming, ...past].map((c: any) => ({
            event: c.name || '',
            start: c.start_time || '',
            end: c.end_time || '',
            resource: 'geeksforgeeks.org',
            href: `https://practice.geeksforgeeks.org/contest/${c.slug}`,
            status: c.status || '',
        }));
    } catch (error) {
        console.error('Error fetching from GFG API:', error);
        return [];
    }
}

function normalizeResource(resource: string): string {
    // Normalize resource names to match SUPPORTED_RESOURCES format
    const normalized = resource.toLowerCase().trim();

    // Handle various formats of resource names
    if (normalized.includes('leetcode')) return 'leetcode.com';
    if (normalized.includes('codeforces')) return 'codeforces.com';
    if (normalized.includes('codechef')) return 'codechef.com';
    if (normalized.includes('geeksforgeeks') || normalized.includes('gfg')) return 'geeksforgeeks.org';
    if (normalized.includes('atcoder')) return 'atcoder.jp';
    if (normalized.includes('hackerrank')) return 'hackerrank.com';
    if (normalized.includes('hackerearth')) return 'hackerearth.com';
    if (normalized.includes('interviewbit')) return 'interviewbit.com';
    if (normalized.includes('codingninjas') || normalized.includes('codestudio')) return 'codingninjas.com';

    return normalized;
}

function filterAndValidateContests(contests: Contest[]): Contest[] {
    const now = new Date();

    console.log('Filtering', contests.length, 'contests');

    const filtered = contests.filter((c) => {
        // Validate required fields
        if (!c.event || !c.start || !c.end || !c.resource) {
            console.log('Skipping contest due to missing fields:', c.event);
            return false;
        }

        // Normalize and check if resource is supported
        const normalizedResource = normalizeResource(c.resource);
        if (!SUPPORTED_RESOURCES.includes(normalizedResource)) {
            console.log('Skipping unsupported resource:', c.resource, '(normalized:', normalizedResource + ')');
            return false;
        }

        // Update the resource to normalized version
        c.resource = normalizedResource;

        try {
            const start = new Date(c.start);
            const end = new Date(c.end);

            // Validate dates
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                console.log('Invalid dates for contest:', c.event);
                return false;
            }

            // Include upcoming and live contests
            const isUpcoming = start >= now;
            const isLive = c.status === 'live' || (now >= start && now <= end);

            return isUpcoming || isLive;
        } catch (error) {
            console.error('Error processing contest:', c.event, error);
            return false;
        }
    });

    console.log('After filtering:', filtered.length, 'contests remain');

    // Group by platform for debugging
    const byPlatform: Record<string, number> = {};
    filtered.forEach(c => {
        byPlatform[c.resource] = (byPlatform[c.resource] || 0) + 1;
    });
    console.log('Contests by platform:', byPlatform);

    return filtered;
}

export async function GET(request: NextRequest) {
    try {
        console.log('Fetching contests...');

        // Fetch contests in parallel
        const [clistContests, gfgContests] = await Promise.all([
            fetchClistContests(),
            fetchGfgContests(),
        ]);

        console.log('Raw contests fetched - Clist:', clistContests.length, 'GFG:', gfgContests.length);

        // Merge and filter
        const merged = [...clistContests, ...gfgContests];
        const filtered = filterAndValidateContests(merged);

        // Sort by start time
        const sorted = filtered.sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
        );

        console.log('Returning', sorted.length, 'contests');

        return NextResponse.json(
            { contests: sorted },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch contests', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
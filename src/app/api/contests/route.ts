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
    'kaggle.com',
    'topcoder.com',
];

const SUPPORTED_RESOURCES = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'geeksforgeeks.org',
    'atcoder.jp',
    'kaggle.com',
    'topcoder.com',
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

// Generate date range based on month and year
function getDateRange(month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month !== undefined ? month : now.getMonth();
    const targetYear = year !== undefined ? year : now.getFullYear();

    // Start from beginning of target month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    // End at end of target month
    const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    return {
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
    };
}

async function fetchClistContests(month?: number, year?: number): Promise<Contest[]> {
    if (!CLIST_API_USERNAME || !CLIST_API_KEY) {
        console.error('CLIST API credentials are not set');
        return [];
    }

    const dateRange = getDateRange(month, year);

    // Use API v4 with proper date filtering
    const apiUrl = `https://clist.by:443/api/v4/contest/?limit=500&start__gt=${dateRange.start}&end__lt=${dateRange.end}&order_by=start&resource__in=${CLIST_RESOURCE_IDS.join(',')}`;

    console.log('Fetching from Clist API:', apiUrl);

    try {
        const res = await fetch(apiUrl, {
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
        console.log('Unique resources from Clist:', uniqueResources);

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
    if (normalized.includes('kaggle')) return 'kaggle.com';
    if (normalized.includes('topcoder')) return 'topcoder.com';

    return normalized;
}

function filterAndValidateContests(contests: Contest[], month?: number, year?: number): Contest[] {
    const dateRange = getDateRange(month, year);
    const startOfMonth = new Date(dateRange.start);
    const endOfMonth = new Date(dateRange.end);

    console.log('Filtering', contests.length, 'contests');
    console.log('Date range:', startOfMonth.toISOString(), 'to', endOfMonth.toISOString());

    const filtered = contests.filter((c) => {
        // Validate required fields
        if (!c.event || !c.start || !c.end || !c.resource) {
            return false;
        }

        // Normalize and check if resource is supported
        const normalizedResource = normalizeResource(c.resource);
        if (!SUPPORTED_RESOURCES.includes(normalizedResource)) {
            return false;
        }

        // Update the resource to normalized version
        c.resource = normalizedResource;

        try {
            const start = new Date(c.start);
            const end = new Date(c.end);

            // Validate dates
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return false;
            }

            // Include contests that overlap with the month
            const isInRange = start <= endOfMonth && end >= startOfMonth;

            return isInRange;
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
        // Get month and year from query parameters
        const searchParams = request.nextUrl.searchParams;
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');

        const month = monthParam ? parseInt(monthParam) - 1 : undefined; // Convert to 0-indexed
        const year = yearParam ? parseInt(yearParam) : undefined;

        console.log('Fetching contests for month:', month !== undefined ? month + 1 : 'current', 'year:', year || 'current');

        // Fetch contests in parallel
        const [clistContests, gfgContests] = await Promise.all([
            fetchClistContests(month, year),
            fetchGfgContests(),
        ]);

        console.log('Raw contests fetched - Clist:', clistContests.length, 'GFG:', gfgContests.length);

        // Merge and filter
        const merged = [...clistContests, ...gfgContests];
        const filtered = filterAndValidateContests(merged, month, year);

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
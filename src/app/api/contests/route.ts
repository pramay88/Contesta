import { NextRequest, NextResponse } from 'next/server';
import { getWithSWR, getContestsCacheKey } from '@/lib/cache';

const CLIST_API_USERNAME = process.env.CLIST_API_USERNAME || '';
const CLIST_API_KEY = process.env.CLIST_API_KEY || '';

// Request specific resources from Clist API (only platforms with active data)
const CLIST_RESOURCE_IDS = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'atcoder.jp',
    'naukri.com/code360',
];

const SUPPORTED_RESOURCES = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'geeksforgeeks.org',
    'atcoder.jp',
    'naukri.com/code360',
];

interface Contest {
    event: string;
    start: string;
    end: string;
    resource: string;
    href: string;
    status?: string;
}

function normalizeDateTime(date: string): string {
    if (!date) return '';

    // Convert formats like "2026-03-29 02:30:00" to ISO string and treat as UTC if no zone is provided
    let normalized = date.trim().replace(' ', 'T');
    const hasOffset = /([Zz]|[+\-]\d{2}:?\d{2})$/.test(normalized);
    if (!hasOffset) {
        normalized = `${normalized}Z`;
    }

    const parsed = new Date(normalized);
    if (isNaN(parsed.getTime())) {
        return '';
    }

    return parsed.toISOString();
}

// Generate date range based on month and year
function getDateRange(month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month !== undefined ? month : now.getMonth();
    const targetYear = year !== undefined ? year : now.getFullYear();

    const startOfMonth = new Date(targetYear, targetMonth, 1);
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

    const apiUrl = `https://clist.by:443/api/v4/contest/?limit=500&start__gt=${dateRange.start}&end__lt=${dateRange.end}&order_by=start&resource__in=${CLIST_RESOURCE_IDS.join(',')}`;

    try {
        const res = await fetch(apiUrl, {
            headers: {
                Authorization: `ApiKey ${CLIST_API_USERNAME}:${CLIST_API_KEY}`,
            },
            // Next.js fetch cache: revalidate every 5 minutes
            next: { revalidate: 300 },
        });

        if (!res.ok) {
            console.error('Failed to fetch from clist.by:', res.statusText);
            return [];
        }

        const data = await res.json();
        console.log('Clist API returned:', data.objects?.length ?? 0, 'contests');

        return (data.objects || []).map((c: Record<string, string>) => ({
            event: c.event || '',
            start: normalizeDateTime(c.start || ''),
            end: normalizeDateTime(c.end || ''),
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
                next: { revalidate: 300 },
            }
        );

        if (!res.ok) {
            console.error('Failed to fetch from GFG API:', res.statusText);
            return [];
        }

        const raw = await res.json();
        const upcoming: Record<string, string>[] = raw?.results?.upcoming || [];
        const past: Record<string, string>[] = raw?.results?.past || [];

        console.log('GFG API returned:', upcoming.length + past.length, 'contests');

        return [...upcoming, ...past].map((c) => ({
            event: c.name || '',
            start: normalizeDateTime(c.start_time || ''),
            end: normalizeDateTime(c.end_time || ''),
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
    const normalized = resource.toLowerCase().trim();

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

    return contests.filter((c) => {
        if (!c.event || !c.start || !c.end || !c.resource) return false;

        const normalizedResource = normalizeResource(c.resource);
        if (!SUPPORTED_RESOURCES.includes(normalizedResource)) return false;

        c.resource = normalizedResource;

        try {
            const start = new Date(c.start);
            const end = new Date(c.end);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;

            // Include contests that overlap with the month
            return start <= endOfMonth && end >= startOfMonth;
        } catch {
            return false;
        }
    });
}

// Core fetch logic (used by cache layer) - exported for refresh endpoint
export async function fetchContestsData(month?: number, year?: number) {
    console.log('Fetching contests for month:', month !== undefined ? month + 1 : 'current', 'year:', year ?? 'current');

    const [clistContests, gfgContests] = await Promise.all([
        fetchClistContests(month, year),
        fetchGfgContests(),
    ]);

    console.log('Raw contests — Clist:', clistContests.length, 'GFG:', gfgContests.length);

    const merged = [...clistContests, ...gfgContests];
    const filtered = filterAndValidateContests(merged, month, year);

    return filtered.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');

        const month = monthParam ? parseInt(monthParam) - 1 : undefined; // Convert to 0-indexed
        const year = yearParam ? parseInt(yearParam) : undefined;

        // Use SWR caching strategy
        const cacheKey = getContestsCacheKey(month, year);
        const { data: contests, source, isStale } = await getWithSWR(
            cacheKey,
            () => fetchContestsData(month, year)
        );

        console.log(`Returning ${contests.length} contests (source: ${source}, stale: ${isStale})`);

        return NextResponse.json(
            {
                contests,
                timestamp: new Date().toISOString(),
                cache: { source, isStale },
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
                    'Content-Type': 'application/json',
                    'X-Cache-Source': source,
                    'X-Cache-Stale': String(isStale),
                },
            }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch contests',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache, getContestsCacheKey, getHackathonsCacheKey, getWithSWR } from '@/lib/cache';

// Optional: Add a secret token for security (set CACHE_REFRESH_TOKEN in env)
const REFRESH_TOKEN = process.env.CACHE_REFRESH_TOKEN;

/**
 * POST /api/refresh
 * Manually invalidate and rebuild the cache
 * 
 * Query params:
 * - type: 'contests' | 'hackathons' | 'all' (default: 'all')
 * - month: number (for contests, 1-indexed)
 * - year: number (for contests)
 * - rebuild: 'true' to fetch fresh data immediately (default: just invalidate)
 * 
 * Headers:
 * - Authorization: Bearer <CACHE_REFRESH_TOKEN> (if token is configured)
 */
export async function POST(request: NextRequest) {
    try {
        // Verify authorization if token is configured
        if (REFRESH_TOKEN) {
            const authHeader = request.headers.get('authorization');
            const token = authHeader?.replace('Bearer ', '');
            
            if (token !== REFRESH_TOKEN) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
        }

        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type') || 'all';
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');
        const rebuild = searchParams.get('rebuild') === 'true';

        const month = monthParam ? parseInt(monthParam) - 1 : undefined;
        const year = yearParam ? parseInt(yearParam) : undefined;

        // Determine which keys to invalidate
        const keysToInvalidate: string[] = [];
        
        if (type === 'contests' || type === 'all') {
            keysToInvalidate.push(getContestsCacheKey(month, year));
        }
        
        if (type === 'hackathons' || type === 'all') {
            keysToInvalidate.push(getHackathonsCacheKey());
        }

        // Invalidate cache
        const invalidated = await invalidateCache(keysToInvalidate);
        console.log(`Invalidated ${invalidated} cache entries for keys:`, keysToInvalidate);

        const result: {
            success: boolean;
            invalidated: number;
            keys: string[];
            rebuilt?: string[];
            timestamp: string;
        } = {
            success: true,
            invalidated,
            keys: keysToInvalidate,
            timestamp: new Date().toISOString(),
        };

        // Optionally rebuild cache immediately
        if (rebuild) {
            const rebuilt: string[] = [];
            
            if (type === 'contests' || type === 'all') {
                // Dynamic import to avoid circular dependency
                const { fetchContestsData } = await import('../contests/route');
                await getWithSWR(
                    getContestsCacheKey(month, year),
                    () => fetchContestsData(month, year),
                    { forceFresh: true }
                );
                rebuilt.push('contests');
            }
            
            if (type === 'hackathons' || type === 'all') {
                const { fetchHackathonsData } = await import('../hackathons/route');
                await getWithSWR(
                    getHackathonsCacheKey(),
                    fetchHackathonsData,
                    { forceFresh: true }
                );
                rebuilt.push('hackathons');
            }
            
            result.rebuilt = rebuilt;
        }

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Refresh API error:', error);
        return NextResponse.json(
            {
                error: 'Failed to refresh cache',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// Also support GET for simple invalidation (no rebuild)
export async function GET(request: NextRequest) {
    // Redirect to POST behavior but without rebuild
    const url = new URL(request.url);
    url.searchParams.delete('rebuild'); // Ensure no rebuild on GET
    
    return POST(new NextRequest(url, { method: 'POST', headers: request.headers }));
}

import { NextRequest, NextResponse } from 'next/server';
import {
    invalidateCache,
    getContestsCacheKey,
    getWithSWR,
    checkRateLimit,
} from '@/lib/cache';

// Optional: Add a secret token for security (set CACHE_REFRESH_TOKEN in env)
const REFRESH_TOKEN = process.env.CACHE_REFRESH_TOKEN;

/**
 * Get client IP for rate limiting
 */
function getClientIP(request: NextRequest): string {
    // Vercel/Cloudflare headers
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    return 'unknown';
}

/**
 * POST /api/refresh
 * Manually invalidate and optionally rebuild the contests cache.
 *
 * Rate limited: 3 requests per minute per IP
 *
 * Query params:
 * - month: number (1-indexed)
 * - year: number
 * - rebuild: 'true' to fetch fresh data immediately
 *
 * Headers:
 * - Authorization: Bearer <CACHE_REFRESH_TOKEN>
 *   (if configured, bypasses rate limiting)
 */
export async function POST(request: NextRequest) {
    try {
        const clientIP = getClientIP(request);
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');
        const hasValidToken = REFRESH_TOKEN && token === REFRESH_TOKEN;

        // Rate limit check (skip if valid token provided)
        if (!hasValidToken) {
            const rateLimit = await checkRateLimit(clientIP);

            if (!rateLimit.allowed) {
                return NextResponse.json(
                    {
                        error: 'Rate limit exceeded',
                        message: `Too many refresh requests. Try again in ${rateLimit.resetIn} seconds.`,
                        resetIn: rateLimit.resetIn,
                    },
                    {
                        status: 429,
                        headers: {
                            'Retry-After': String(rateLimit.resetIn),
                            'X-RateLimit-Remaining': '0',
                            'X-RateLimit-Reset': String(rateLimit.resetIn),
                        },
                    }
                );
            }
        }

        const searchParams = request.nextUrl.searchParams;
        const monthParam = searchParams.get('month');
        const yearParam = searchParams.get('year');
        const rebuild = searchParams.get('rebuild') === 'true';

        const month = monthParam ? parseInt(monthParam, 10) - 1 : undefined;
        const year = yearParam ? parseInt(yearParam, 10) : undefined;

        const cacheKey = getContestsCacheKey(month, year);

        // Invalidate cache
        const invalidated = await invalidateCache([cacheKey]);

        console.log(`Invalidated ${invalidated} cache entries for key: ${cacheKey}`);

        const result: {
            success: boolean;
            invalidated: number;
            keys: string[];
            rebuilt?: string[];
            timestamp: string;
        } = {
            success: true,
            invalidated,
            keys: [cacheKey],
            timestamp: new Date().toISOString(),
        };

        // Optionally rebuild cache immediately
        if (rebuild) {
            const { fetchContestsData } = await import('../contests/route');

            await getWithSWR(
                cacheKey,
                () => fetchContestsData(month, year),
                { forceFresh: true }
            );

            result.rebuilt = ['contests'];
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
    const url = new URL(request.url);

    // Ensure GET never triggers a rebuild
    url.searchParams.delete('rebuild');

    return POST(
        new NextRequest(url, {
            method: 'POST',
            headers: request.headers,
        })
    );
}
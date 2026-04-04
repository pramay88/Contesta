import { Redis } from '@upstash/redis';

// Initialize Redis client (uses UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars)
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache configuration
const CACHE_CONFIG = {
    FRESH_TTL: 15 * 60,      // 15 minutes - data considered fresh
    STALE_TTL: 20 * 60,      // 20 minutes - total TTL (5 min stale window)
    STALE_MARKER_PREFIX: 'stale:',
};

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    freshUntil: number;
}

interface CacheResult<T> {
    data: T;
    source: 'cache' | 'fetch';
    isStale: boolean;
}

/**
 * Get data with SWR (stale-while-revalidate) strategy
 * - Fresh data: return immediately
 * - Stale data: return immediately + trigger background refresh
 * - No data: fetch, store, return
 */
export async function getWithSWR<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options?: { forceFresh?: boolean }
): Promise<CacheResult<T>> {
    const now = Date.now();

    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn('Upstash Redis not configured, fetching directly');
        const data = await fetchFn();
        return { data, source: 'fetch', isStale: false };
    }

    try {
        // Force fresh fetch if requested
        if (options?.forceFresh) {
            return await fetchAndCache(key, fetchFn);
        }

        // Try to get cached data
        const cached = await redis.get<CacheEntry<T>>(key);

        if (cached) {
            const isFresh = now < cached.freshUntil;

            if (isFresh) {
                // Fresh data - return immediately
                console.log(`Cache HIT (fresh): ${key}`);
                return { data: cached.data, source: 'cache', isStale: false };
            }

            // Stale data - return immediately and trigger background refresh
            console.log(`Cache HIT (stale): ${key} - triggering background refresh`);
            
            // Trigger background refresh (don't await)
            triggerBackgroundRefresh(key, fetchFn).catch((err) => {
                console.error(`Background refresh failed for ${key}:`, err);
            });

            return { data: cached.data, source: 'cache', isStale: true };
        }

        // Cache miss - fetch and store
        console.log(`Cache MISS: ${key}`);
        return await fetchAndCache(key, fetchFn);
    } catch (error) {
        console.error(`Cache error for ${key}:`, error);
        // Fallback to direct fetch on cache error
        const data = await fetchFn();
        return { data, source: 'fetch', isStale: false };
    }
}

/**
 * Fetch data and store in cache
 */
async function fetchAndCache<T>(
    key: string,
    fetchFn: () => Promise<T>
): Promise<CacheResult<T>> {
    const data = await fetchFn();
    const now = Date.now();

    const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        freshUntil: now + CACHE_CONFIG.FRESH_TTL * 1000,
    };

    // Store with total TTL (fresh + stale window)
    await redis.set(key, entry, { ex: CACHE_CONFIG.STALE_TTL });
    console.log(`Cached: ${key} (TTL: ${CACHE_CONFIG.STALE_TTL}s)`);

    return { data, source: 'fetch', isStale: false };
}

/**
 * Background refresh - uses a lock to prevent thundering herd
 */
async function triggerBackgroundRefresh<T>(
    key: string,
    fetchFn: () => Promise<T>
): Promise<void> {
    const lockKey = `${CACHE_CONFIG.STALE_MARKER_PREFIX}${key}`;

    // Try to acquire lock (30 second TTL)
    const acquired = await redis.set(lockKey, '1', { ex: 30, nx: true });

    if (!acquired) {
        console.log(`Background refresh already in progress for: ${key}`);
        return;
    }

    try {
        const data = await fetchFn();
        const now = Date.now();

        const entry: CacheEntry<T> = {
            data,
            timestamp: now,
            freshUntil: now + CACHE_CONFIG.FRESH_TTL * 1000,
        };

        await redis.set(key, entry, { ex: CACHE_CONFIG.STALE_TTL });
        console.log(`Background refresh complete: ${key}`);
    } finally {
        // Release lock
        await redis.del(lockKey);
    }
}

/**
 * Invalidate cache entries by pattern or specific key
 */
export async function invalidateCache(keys: string[]): Promise<number> {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return 0;
    }

    try {
        let deleted = 0;
        for (const key of keys) {
            const result = await redis.del(key);
            deleted += result;
            // Also delete any stale marker
            await redis.del(`${CACHE_CONFIG.STALE_MARKER_PREFIX}${key}`);
        }
        console.log(`Invalidated ${deleted} cache entries`);
        return deleted;
    } catch (error) {
        console.error('Cache invalidation error:', error);
        return 0;
    }
}

/**
 * Generate cache key for contests
 */
export function getContestsCacheKey(month?: number, year?: number): string {
    const now = new Date();
    const m = month !== undefined ? month : now.getMonth();
    const y = year !== undefined ? year : now.getFullYear();
    return `contests:${y}:${m}`;
}

/**
 * Generate cache key for hackathons
 */
export function getHackathonsCacheKey(): string {
    return 'hackathons';
}

/**
 * Get all known cache keys for invalidation
 */
export function getAllCacheKeys(month?: number, year?: number): string[] {
    return [
        getContestsCacheKey(month, year),
        getHackathonsCacheKey(),
    ];
}

export { redis };

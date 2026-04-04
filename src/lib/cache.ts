import { Redis } from '@upstash/redis';

// Lazy-initialize Redis client to avoid errors when env vars aren't set
let redis: Redis | null = null;

function getRedis(): Redis | null {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        return null;
    }
    if (!redis) {
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
    }
    return redis;
}

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
    const redisClient = getRedis();

    // Check if Redis is configured
    if (!redisClient) {
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
        const cached = await redisClient.get<CacheEntry<T>>(key);

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
    const redisClient = getRedis();
    const data = await fetchFn();
    const now = Date.now();

    const entry: CacheEntry<T> = {
        data,
        timestamp: now,
        freshUntil: now + CACHE_CONFIG.FRESH_TTL * 1000,
    };

    // Store with total TTL (fresh + stale window)
    if (redisClient) {
        await redisClient.set(key, entry, { ex: CACHE_CONFIG.STALE_TTL });
        console.log(`Cached: ${key} (TTL: ${CACHE_CONFIG.STALE_TTL}s)`);
    }

    return { data, source: 'fetch', isStale: false };
}

/**
 * Background refresh - uses a lock to prevent thundering herd
 */
async function triggerBackgroundRefresh<T>(
    key: string,
    fetchFn: () => Promise<T>
): Promise<void> {
    const redisClient = getRedis();
    if (!redisClient) return;

    const lockKey = `${CACHE_CONFIG.STALE_MARKER_PREFIX}${key}`;

    // Try to acquire lock (30 second TTL)
    const acquired = await redisClient.set(lockKey, '1', { ex: 30, nx: true });

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

        await redisClient.set(key, entry, { ex: CACHE_CONFIG.STALE_TTL });
        console.log(`Background refresh complete: ${key}`);
    } finally {
        // Release lock
        await redisClient.del(lockKey);
    }
}

/**
 * Invalidate cache entries by pattern or specific key
 */
export async function invalidateCache(keys: string[]): Promise<number> {
    const redisClient = getRedis();
    if (!redisClient) {
        return 0;
    }

    try {
        let deleted = 0;
        for (const key of keys) {
            const result = await redisClient.del(key);
            deleted += result;
            // Also delete any stale marker
            await redisClient.del(`${CACHE_CONFIG.STALE_MARKER_PREFIX}${key}`);
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

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    WINDOW_SECONDS: 60,      // 1 minute window
    MAX_REQUESTS: 3,         // Max 3 refresh requests per minute per IP
    PREFIX: 'ratelimit:refresh:',
};

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // seconds until reset
}

/**
 * Check rate limit for an identifier (e.g., IP address)
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
    const redisClient = getRedis();
    
    // If Redis not configured, allow all requests
    if (!redisClient) {
        return { allowed: true, remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS, resetIn: 0 };
    }

    const key = `${RATE_LIMIT_CONFIG.PREFIX}${identifier}`;
    
    try {
        // Increment counter
        const count = await redisClient.incr(key);
        
        // Set expiry on first request
        if (count === 1) {
            await redisClient.expire(key, RATE_LIMIT_CONFIG.WINDOW_SECONDS);
        }
        
        // Get TTL for reset time
        const ttl = await redisClient.ttl(key);
        
        const allowed = count <= RATE_LIMIT_CONFIG.MAX_REQUESTS;
        const remaining = Math.max(0, RATE_LIMIT_CONFIG.MAX_REQUESTS - count);
        
        return {
            allowed,
            remaining,
            resetIn: ttl > 0 ? ttl : RATE_LIMIT_CONFIG.WINDOW_SECONDS,
        };
    } catch (error) {
        console.error('Rate limit check error:', error);
        // On error, allow the request
        return { allowed: true, remaining: RATE_LIMIT_CONFIG.MAX_REQUESTS, resetIn: 0 };
    }
}

export { getRedis };

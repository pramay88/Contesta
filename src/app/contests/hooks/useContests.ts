import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { isAfter, isSameDay, isBefore, startOfDay } from 'date-fns';
import { Contest, SUPPORTED_RESOURCES, DifficultyLevel, DurationCategory, DifficultyFilter, DurationFilter } from '../constants';

interface RefreshState {
    isRefreshing: boolean;
    lastRefreshed: Date | null;
    error: string | null;
    rateLimitReset: number | null;
}

export function useContests(currentDate?: Date, difficultyFilter: DifficultyFilter = 'all', durationFilter: DurationFilter = 'all') {
    const [contests, setContests] = useState<Contest[]>([]);
    // `loading` is true only on the very first fetch (no data yet)
    const [loading, setLoading] = useState(true);
    // `isFetching` is true whenever a fetch is in-flight (including re-fetches)
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    // Refresh state
    const [refreshState, setRefreshState] = useState<RefreshState>({
        isRefreshing: false,
        lastRefreshed: null,
        error: null,
        rateLimitReset: null,
    });

    // Track whether we have ever successfully loaded data
    const hasData = useRef(false);

    const fetchContests = useCallback(async (date?: Date) => {
        // Only show the full skeleton on the very first load
        if (!hasData.current) {
            setLoading(true);
        }
        setIsFetching(true);
        setError('');
        try {
            const targetDate = date || new Date();
            const month = targetDate.getMonth() + 1; // Convert to 1-indexed
            const year = targetDate.getFullYear();

            const url = `/api/contests?month=${month}&year=${year}`;
            console.log('Fetching contests from:', url);

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch contests');
            const data = await res.json();
            setContests(data.contests || []);
            hasData.current = true;
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to fetch contests';
            setError(message);
            // Only clear displayed data if we have nothing to show
            if (!hasData.current) {
                setContests([]);
            }
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    }, []);

    // Manual refresh with cache invalidation
    const refreshContests = useCallback(async () => {
        if (refreshState.isRefreshing) return;

        setRefreshState(prev => ({ ...prev, isRefreshing: true, error: null }));

        try {
            const targetDate = currentDate || new Date();
            const month = targetDate.getMonth() + 1;
            const year = targetDate.getFullYear();

            // Call refresh endpoint to invalidate and rebuild cache
            const refreshRes = await fetch(
                `/api/refresh?type=contests&month=${month}&year=${year}&rebuild=true`,
                { method: 'POST' }
            );

            if (refreshRes.status === 429) {
                const data = await refreshRes.json();
                setRefreshState(prev => ({
                    ...prev,
                    isRefreshing: false,
                    error: data.message || 'Rate limit exceeded',
                    rateLimitReset: data.resetIn || 60,
                }));
                return;
            }

            if (!refreshRes.ok) {
                throw new Error('Failed to refresh cache');
            }

            // Fetch fresh data
            await fetchContests(currentDate);
            
            setRefreshState(prev => ({
                ...prev,
                isRefreshing: false,
                lastRefreshed: new Date(),
                error: null,
                rateLimitReset: null,
            }));
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to refresh';
            setRefreshState(prev => ({
                ...prev,
                isRefreshing: false,
                error: message,
            }));
        }
    }, [currentDate, fetchContests, refreshState.isRefreshing]);

    useEffect(() => {
        fetchContests(currentDate);
    }, [fetchContests, currentDate]);

    const today = startOfDay(new Date());

    const classifyDifficulty = (c: Contest): DifficultyLevel => {
        const title = (c.event || '').toLowerCase();
        const resource = (c.resource || '').toLowerCase();

        try {
            if (resource === 'leetcode.com') {
                if (title.includes('weekly') || title.includes('biweekly') || title.includes('contest')) {
                    return 'mixed';
                }
                if (title.includes('easy')) return 'beginner';
                if (title.includes('medium')) return 'intermediate';
                if (title.includes('hard')) return 'advanced';
            }

            if (resource === 'codeforces.com') {
                if (title.includes('div. 4') || title.includes('div 4') || title.includes('div. 3') || title.includes('div 3')) return 'beginner';
                if (title.includes('div. 2') || title.includes('div 2')) return 'intermediate';
                if (title.includes('div. 1') || title.includes('div 1')) return 'advanced';
                if (title.includes('educational') || title.includes('global round') || title.includes('icpc')) return 'mixed';
            }

            if (resource === 'codechef.com') {
                if (title.includes('starters') || title.includes('lunchtime')) return 'beginner';
                if (title.includes('cook-off') || title.includes('cookoff') || title.includes('educational')) return 'intermediate';
                if (title.includes('long challenge') || title.includes('longchallenge')) return 'mixed';
            }

            if (resource === 'atcoder.jp') {
                if (title.includes('abc') || title.includes('beginner')) return 'beginner';
                if (title.includes('arc') || title.includes('regular')) return 'intermediate';
                if (title.includes('agc') || title.includes('grand')) return 'advanced';
            }

            if (resource === 'geeksforgeeks.org' || resource === 'naukri.com/code360') {
                return 'beginner';
            }
        } catch {
            // if classification fails, continue to default
        }

        return 'unknown';
    };

    const getDurationCategory = (minutes: number): DurationCategory => {
        if (!Number.isFinite(minutes) || minutes <= 0) return 'unknown';
        if (minutes <= 120) return 'short';
        if (minutes <= 300) return 'medium';
        return 'long';
    };

    const annotateContests = (items: Contest[]) => {
        return items.map((contest) => {
            const start = new Date(contest.start);
            const end = new Date(contest.end);
            const durationMinutes = isNaN(start.getTime()) || isNaN(end.getTime()) ? 0 : Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
            const difficulty = classifyDifficulty(contest);
            const durationCategory = getDurationCategory(durationMinutes);
            return {
                ...contest,
                difficulty,
                durationMinutes,
                durationCategory,
            };
        });
    };

    const filteredContests = useMemo(() => {
        return contests.filter((c) => {
            const resource = c.resource?.toLowerCase();
            const matchesSupported = SUPPORTED_RESOURCES.includes(resource);
            const matchesPlatform =
                selectedPlatforms.length === 0 ||
                selectedPlatforms.includes(resource);
            const matchesSearch =
                search.trim() === '' ||
                c.event.toLowerCase().includes(search.trim().toLowerCase());
            return matchesSupported && matchesPlatform && matchesSearch;
        });
    }, [contests, search, selectedPlatforms]);

    const annotatedContests = useMemo(() => annotateContests(filteredContests), [filteredContests]);

    const filteredByDifficultyDuration = useMemo(() =>
        annotatedContests.filter((c) => {
            const matchesDifficulty = difficultyFilter === 'all' || (c.difficulty || 'unknown') === difficultyFilter;
            const matchesDuration = durationFilter === 'all' || (c.durationCategory || 'unknown') === durationFilter;
            return matchesDifficulty && matchesDuration;
        }),
        [annotatedContests, difficultyFilter, durationFilter]
    );

    const upcomingContests = useMemo(
        () =>
            filteredByDifficultyDuration.filter(
                (c) =>
                    isAfter(new Date(c.start), today) ||
                    isSameDay(new Date(c.start), today)
            ),
        [filteredByDifficultyDuration, today]
    );

    const allCalendarEvents = useMemo(
        () =>
            filteredByDifficultyDuration.map((contest, idx) => {
                const contestStart = startOfDay(new Date(contest.start));
                let bgColor = '#6f95c8d2'; // Future - Light Blue

                if (isBefore(contestStart, today)) {
                    bgColor = '#d1d5db'; // Past - Light Gray
                } else if (isSameDay(contestStart, today)) {
                    bgColor = '#34d399'; // Today - Light Green
                }

                return {
                    id: idx + 1,
                    title: contest.event,
                    start: new Date(contest.start),
                    end: new Date(contest.end),
                    resource: contest.resource,
                    url: contest.href,
                    allDay: false,
                    bgColor,
                };
            }),
        [annotatedContests, today]
    );

    return {
        contests,
        loading,
        isFetching,
        error,
        search,
        setSearch,
        selectedPlatforms,
        setSelectedPlatforms,
        upcomingContests,
        allCalendarEvents,
        today,
        refreshContests,
        refreshState,
    };
}

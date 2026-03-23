import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { isAfter, isSameDay, isBefore, startOfDay } from 'date-fns';
import { Contest, SUPPORTED_RESOURCES } from '../constants';

export function useContests(currentDate?: Date) {
    const [contests, setContests] = useState<Contest[]>([]);
    // `loading` is true only on the very first fetch (no data yet)
    const [loading, setLoading] = useState(true);
    // `isFetching` is true whenever a fetch is in-flight (including re-fetches)
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

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

    useEffect(() => {
        fetchContests(currentDate);
    }, [fetchContests, currentDate]);

    const today = startOfDay(new Date());

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

    const upcomingContests = useMemo(
        () =>
            filteredContests.filter(
                (c) =>
                    isAfter(new Date(c.start), today) ||
                    isSameDay(new Date(c.start), today)
            ),
        [filteredContests, today]
    );

    // For calendar - all contests with color coding
    const allCalendarEvents = useMemo(
        () =>
            filteredContests.map((contest, idx) => {
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
        [filteredContests, today]
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
    };
}

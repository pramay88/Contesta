import { useState, useEffect, useCallback, useMemo } from 'react';
import { isAfter, isSameDay, isBefore, startOfDay } from 'date-fns';
import { Contest, SUPPORTED_RESOURCES } from '../constants';

export function useContests() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    const fetchContests = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/contests');
            if (!res.ok) throw new Error('Failed to fetch contests');
            const data = await res.json();
            setContests(data.contests || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch contests');
            setContests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContests();
        const interval = setInterval(fetchContests, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchContests]);

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

    // For sidebar - only upcoming contests
    const calendarEvents = useMemo(
        () =>
            upcomingContests.map((contest, idx) => ({
                id: idx + 1,
                title: contest.event,
                start: new Date(contest.start),
                end: new Date(contest.end),
                resource: contest.resource,
                url: contest.href,
                allDay: false,
                bgColor: '#2563eb',
            })),
        [upcomingContests]
    );

    // For calendar - all contests with color coding
    const allCalendarEvents = useMemo(
        () =>
            filteredContests.map((contest, idx) => {
                const contestStart = startOfDay(new Date(contest.start));
                let bgColor = '#2563eb'; // Future - Blue

                if (isBefore(contestStart, today)) {
                    bgColor = '#9ca3af'; // Past - Gray
                } else if (isSameDay(contestStart, today)) {
                    bgColor = '#10b981'; // Today - Green
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
        error,
        search,
        setSearch,
        selectedPlatforms,
        setSelectedPlatforms,
        upcomingContests,
        calendarEvents,
        allCalendarEvents,
        today,
    };
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Hackathon } from './constants';
import { filterHackathons } from '@/lib/hackathons';

export function useHackathons() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        const controller = new AbortController();

        async function fetchHackathons() {
            setLoading(true);
            setError('');

            try {
                const res = await fetch('/api/hackathons', { signal: controller.signal });

                if (!res.ok) {
                    throw new Error('Failed to fetch hackathons');
                }

                const data: { hackathons?: Hackathon[] } = await res.json();
                setHackathons(data.hackathons ?? []);
            } catch (err: unknown) {
                if (controller.signal.aborted) {
                    return;
                }

                setHackathons([]);
                setError(err instanceof Error ? err.message : 'Failed to fetch hackathons');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        void fetchHackathons();

        return () => {
            controller.abort();
        };
    }, []);

    const filteredHackathons = useMemo(
        () =>
            filterHackathons(hackathons, {
                search,
                platform: platformFilter as Hackathon['platform'] | 'all',
                status: statusFilter as 'all' | Hackathon['status'],
                type: typeFilter as 'all' | Hackathon['type'],
            }),
        [hackathons, search, platformFilter, statusFilter, typeFilter]
    );

    return {
        hackathons: filteredHackathons,
        loading,
        error,
        search,
        setSearch,
        platformFilter,
        setPlatformFilter,
        statusFilter,
        setStatusFilter,
        typeFilter,
        setTypeFilter,
        totalCount: hackathons.length,
        filteredCount: filteredHackathons.length,
    };
}

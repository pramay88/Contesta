'use client';

import { useState, useEffect } from 'react';
import type { Hackathon } from './constants';

export function useHackathons() {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [platformFilter, setPlatformFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    useEffect(() => {
        fetchHackathons();
    }, []);

    async function fetchHackathons() {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/hackathons');
            if (!res.ok) throw new Error('Failed to fetch hackathons');
            const data = await res.json();
            setHackathons(data.hackathons || []);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch hackathons');
            setHackathons([]);
        } finally {
            setLoading(false);
        }
    }

    // Filter hackathons
    const filteredHackathons = hackathons.filter(h => {
        // Search filter
        if (search && !h.title.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Platform filter
        if (platformFilter !== 'all' && h.platform !== platformFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all' && h.status !== statusFilter) {
            return false;
        }

        // Type filter
        if (typeFilter !== 'all' && h.type !== typeFilter) {
            return false;
        }

        return true;
    });

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

'use client';

import { useState } from 'react';
import { useHackathons } from './useHackathons';
import { PLATFORM_OPTIONS, STATUS_OPTIONS, TYPE_OPTIONS } from './constants';
import { BsSearch, BsFilter, BsTrophy } from 'react-icons/bs';
import { HackathonCard } from '@/components/HackathonCard';

export default function HackathonsPage() {
    const {
        hackathons,
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
        totalCount,
        filteredCount,
    } = useHackathons();

    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
            <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:px-6">
                <section className="rounded-3xl border p-5 shadow-sm" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Hackathons</h1>
                            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Discover hackathons from Devpost, Unstop, and Kaggle.
                            </p>
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {filteredCount} of {totalCount} hackathons
                        </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <label className="relative flex-1">
                            <BsSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="search"
                                placeholder="Search hackathons, organizers, skills..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                className="w-full rounded-2xl border py-3 pl-10 pr-4 text-sm outline-none transition-colors"
                                style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                            />
                        </label>

                        <button
                            type="button"
                            onClick={() => setShowFilters((value) => !value)}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors"
                            style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        >
                            <BsFilter className="h-4 w-4" />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 grid gap-4 rounded-2xl border p-4 md:grid-cols-3" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-hover)' }}>
                            <label className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Platform
                                <select
                                    value={platformFilter}
                                    onChange={(event) => setPlatformFilter(event.target.value)}
                                    className="rounded-xl border px-3 py-2 outline-none"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                >
                                    {PLATFORM_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Status
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="rounded-xl border px-3 py-2 outline-none"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                >
                                    {STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Type
                                <select
                                    value={typeFilter}
                                    onChange={(event) => setTypeFilter(event.target.value)}
                                    className="rounded-xl border px-3 py-2 outline-none"
                                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                >
                                    {TYPE_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    )}
                </section>

                {loading && (
                    <div className="rounded-3xl border p-8 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
                        Loading hackathons...
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                        {error}
                    </div>
                )}

                {!loading && !error && filteredCount === 0 && (
                    <div className="rounded-3xl border p-10 text-center" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
                        <BsTrophy className="mx-auto mb-4 h-14 w-14" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>No hackathons found</p>
                        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>Try broadening the filters or clearing the search.</p>
                    </div>
                )}

                {!loading && !error && filteredCount > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {hackathons.map((hackathon) => (
                            <HackathonCard key={hackathon.id} hackathon={hackathon} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

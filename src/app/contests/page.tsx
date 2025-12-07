'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
import { ViewToggle } from '@/components/ViewToggle';
import { useContests } from './hooks/useContests';

export default function ContestsPage() {
    const [mobileView, setMobileView] = useState<'list' | 'calendar'>('calendar');

    const {
        loading,
        error,
        search,
        setSearch,
        selectedPlatforms,
        setSelectedPlatforms,
        upcomingContests,
        calendarEvents,
        today,
    } = useContests();

    return (
        <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
            {/* Mobile View Toggle */}
            <ViewToggle view={mobileView} onViewChange={setMobileView} />

            <div className="flex flex-col md:flex-row gap-4 overflow-x-hidden">
                {/* Sidebar - Always visible on desktop, conditional on mobile */}
                <aside className={`w-full md:w-1/3 lg:w-1/4 ${mobileView === 'list' ? 'block' : 'hidden md:block'}`}>
                    <ContestsSidebar
                        search={search}
                        onSearchChange={setSearch}
                        selectedPlatforms={selectedPlatforms}
                        onPlatformChange={(p) => setSelectedPlatforms(p ? [p] : [])}
                        upcomingContests={upcomingContests}
                        loading={loading}
                        error={error}
                    />
                </aside>

                {/* Main Calendar - Always visible on desktop, conditional on mobile */}
                <main className={`flex-1 min-w-0 ${mobileView === 'calendar' ? 'block' : 'hidden md:block'}`}>
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{format(today, 'LLLL yyyy')}</h2>
                        <ContestsCalendar
                            events={calendarEvents}
                            loading={loading}
                            currentMonth={format(today, 'LLLL yyyy')}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
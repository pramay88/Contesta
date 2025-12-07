'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
import { ViewToggle } from '@/components/ViewToggle';
import { useContests } from './hooks/useContests';

export default function ContestsPage() {
    const [mobileView, setMobileView] = useState<'list' | 'calendar'>('calendar');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const {
        loading,
        error,
        search,
        setSearch,
        selectedPlatforms,
        setSelectedPlatforms,
        upcomingContests,
        allCalendarEvents,
        today,
    } = useContests();

    // Filter contests based on selected date
    const displayedContests = selectedDate
        ? upcomingContests.filter((contest) => {
            const contestDate = new Date(contest.start);
            return (
                contestDate.getFullYear() === selectedDate.getFullYear() &&
                contestDate.getMonth() === selectedDate.getMonth() &&
                contestDate.getDate() === selectedDate.getDate()
            );
        })
        : upcomingContests;

    // Handle date selection from calendar
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const clickedDate = new Date(slotInfo.start);
        clickedDate.setHours(0, 0, 0, 0);

        // Toggle: if same date clicked, deselect
        if (selectedDate) {
            const currentSelected = new Date(selectedDate);
            currentSelected.setHours(0, 0, 0, 0);

            if (clickedDate.getTime() === currentSelected.getTime()) {
                setSelectedDate(null);
                return;
            }
        }

        setSelectedDate(clickedDate);
    };

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
                        upcomingContests={displayedContests}
                        loading={loading}
                        error={error}
                        selectedDate={selectedDate}
                        onClearSelection={() => setSelectedDate(null)}
                    />
                </aside>

                {/* Main Calendar - Always visible on desktop, conditional on mobile */}
                <main className={`flex-1 min-w-0 ${mobileView === 'calendar' ? 'block' : 'hidden md:block'}`}>
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-5">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{format(currentDate, 'LLLL yyyy')}</h2>
                        <ContestsCalendar
                            events={allCalendarEvents}
                            loading={loading}
                            currentDate={currentDate}
                            onNavigate={setCurrentDate}
                            selectedDate={selectedDate}
                            onSelectSlot={handleSelectSlot}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/contestsCalendar';
import { StatsHeader } from '@/components/StatsHeader';
import { PlatformFilter } from '@/components/PlatformFilter';
import { useContests } from './hooks/useContests';
import { BsListUl, BsCalendar3, BsTrophy } from 'react-icons/bs';

export default function ContestsPage() {
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
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

    // Stats Logic
    const todayCount = upcomingContests.filter(c => {
        const start = new Date(c.start);
        const today = new Date();
        return start.getDate() === today.getDate() &&
            start.getMonth() === today.getMonth() &&
            start.getFullYear() === today.getFullYear();
    }).length;

    const weekCount = upcomingContests.filter(c => {
        const start = new Date(c.start);
        const now = new Date();
        const nextWeek = new Date(); nextWeek.setDate(now.getDate() + 7);
        return start >= now && start <= nextWeek;
    }).length;

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const clickedDate = new Date(slotInfo.start);
        clickedDate.setHours(0, 0, 0, 0);

        if (selectedDate && selectedDate.getTime() === clickedDate.getTime()) {
            setSelectedDate(null);
        } else {
            setSelectedDate(clickedDate);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-4 font-sans overflow-hidden">
            {/* Header Area */}
            <div className="max-w-[1600px] mx-auto mb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                        {/* Logo */}
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg shadow-md">
                            <BsTrophy className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Contesta.io</h1>
                            <p className="text-gray-500 text-xs">All coding contests in one place</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm shadow-sm hover:bg-gray-50 font-medium">
                            <BsCalendar3 className="w-3.5 h-3.5" /> Calendar
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm shadow-sm hover:bg-gray-50 font-medium">
                            <BsListUl className="w-3.5 h-3.5" /> List
                        </button>
                    </div>
                </div>

                {/* Sub-Header: Stats & Filter */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <StatsHeader
                        todayCount={todayCount}
                        weekCount={weekCount}
                        upcomingCount={upcomingContests.length}
                    />

                    <div className="w-full lg:w-64">
                        <PlatformFilter
                            selectedPlatforms={selectedPlatforms}
                            onPlatformChange={setSelectedPlatforms}
                            isLoading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Content Grid - Optimized for single page */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-3 h-[calc(100vh-180px)]">
                {/* Calendar Section (Left, 2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-3 overflow-hidden">
                    <ContestsCalendar
                        events={allCalendarEvents}
                        loading={loading}
                        currentDate={currentDate}
                        onNavigate={setCurrentDate}
                        selectedDate={selectedDate}
                        onSelectSlot={handleSelectSlot}
                    />
                </div>

                {/* Sidebar Section (Right, 1 col) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 overflow-hidden">
                    <ContestsSidebar
                        search={search}
                        onSearchChange={setSearch}
                        upcomingContests={upcomingContests}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>
        </div>
    );
}

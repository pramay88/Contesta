'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { ContestsSidebar } from '@/components/ContestsSidebar';
import { ContestsCalendar } from '@/components/ContestsCalendar';
import { StatsHeader } from '@/components/StatsHeader';
import { PlatformFilter } from '@/components/PlatformFilter';
import { useContests } from './hooks/useContests';
import { BsListUl, BsCalendar3 } from 'react-icons/bs';
import { ContestaLogo } from '@/components/ContestaLogo';

export default function ContestsPage() {
    // Desktop: both can be shown, Mobile: only one
    const [showCalendar, setShowCalendar] = useState(true);
    const [showList, setShowList] = useState(true);
    const [mobileView, setMobileView] = useState<'calendar' | 'list'>('calendar');

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
    } = useContests(currentDate);

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

    // Desktop toggle handlers
    const toggleCalendar = () => setShowCalendar(!showCalendar);
    const toggleList = () => setShowList(!showList);

    // Mobile toggle handlers
    const setMobileCalendar = () => setMobileView('calendar');
    const setMobileList = () => setMobileView('list');

    return (
        <div className="min-h-screen bg-gray-50 p-3 md:p-4 font-sans overflow-x-hidden">
            {/* Header Area */}
            <div className="max-w-[1600px] mx-auto mb-3">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                        {/* Logo */}
                        <div className="bg-gradient-to-br from-green-500 to-blue-500 p-2 rounded-lg shadow-md">
                            <ContestaLogo className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Contesta.io</h1>
                            <p className="text-gray-500 text-xs hidden sm:block">All contests in one place</p>
                        </div>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Desktop - Both can be selected */}
                        <button
                            onClick={toggleCalendar}
                            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm shadow-sm font-medium transition-all ${showCalendar
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BsCalendar3 className="w-3.5 h-3.5" /> Calendar
                        </button>
                        <button
                            onClick={toggleList}
                            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm shadow-sm font-medium transition-all ${showList
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BsListUl className="w-3.5 h-3.5" /> List
                        </button>

                        {/* Mobile - Only one can be selected */}
                        <button
                            onClick={setMobileCalendar}
                            className={`lg:hidden flex items-center justify-center px-2.5 py-1.5 border rounded-lg text-sm shadow-sm font-medium transition-all ${mobileView === 'calendar'
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BsCalendar3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={setMobileList}
                            className={`lg:hidden flex items-center justify-center px-2.5 py-1.5 border rounded-lg text-sm shadow-sm font-medium transition-all ${mobileView === 'list'
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <BsListUl className="w-4 h-4" />
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

            {/* Content Grid */}
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {/* DESKTOP Calendar */}
                    {showCalendar && (
                        <div className={`hidden lg:block ${showCalendar && showList ? 'lg:col-span-2' : 'lg:col-span-3'
                            }`}>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                                <ContestsCalendar
                                    events={allCalendarEvents}
                                    loading={loading}
                                    currentDate={currentDate}
                                    onNavigate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    onSelectSlot={handleSelectSlot}
                                />
                            </div>
                        </div>
                    )}

                    {/* DESKTOP Sidebar */}
                    {showList && (
                        <div className={`hidden lg:block ${showCalendar && showList ? 'lg:col-span-1' : 'lg:col-span-3'
                            }`}>
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
                    )}

                    {/* MOBILE Calendar */}
                    {mobileView === 'calendar' && (
                        <div className="block lg:hidden col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
                                <ContestsCalendar
                                    events={allCalendarEvents}
                                    loading={loading}
                                    currentDate={currentDate}
                                    onNavigate={setCurrentDate}
                                    selectedDate={selectedDate}
                                    onSelectSlot={handleSelectSlot}
                                />
                            </div>
                        </div>
                    )}

                    {/* MOBILE Sidebar */}
                    {mobileView === 'list' && (
                        <div className="block lg:hidden col-span-1">
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
                    )}
                </div>
            </div>
        </div>
    );
}

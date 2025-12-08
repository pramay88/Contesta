import React, { useState } from 'react';
import { format } from 'date-fns';
import { Contest } from '@/app/contests/constants';
import { UpcomingList } from './UpcomingList';
import { FilterTabs } from './FilterTabs';
import { FiSearch } from 'react-icons/fi';

interface ContestsSidebarProps {
    search: string;
    onSearchChange: (value: string) => void;
    upcomingContests: Contest[];
    loading: boolean;
    error: string;
}

export function ContestsSidebar({
    search,
    onSearchChange,
    upcomingContests,
    loading,
    error,
}: ContestsSidebarProps) {
    const [currentFilter, setCurrentFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

    // Filter logic relative to "now"
    const filteredContests = upcomingContests.filter(contest => {
        const start = new Date(contest.start);
        const now = new Date();
        const endOfToday = new Date(); endOfToday.setHours(23, 59, 59, 999);
        const endOfWeek = new Date(); endOfWeek.setDate(now.getDate() + 7);
        const endOfMonth = new Date(); endOfMonth.setMonth(now.getMonth() + 1);

        switch (currentFilter) {
            case 'today':
                return start >= now && start <= endOfToday;
            case 'week':
                return start >= now && start <= endOfWeek;
            case 'month':
                return start >= now && start <= endOfMonth;
            default:
                return true;
        }
    });

    return (
        <div className="flex flex-col gap-3 h-[calc(100vh-220px)]">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search contests..."
                    className="block w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5">
                <button className="bg-purple-600 text-white rounded-lg p-1.5 font-medium text-xs w-10 flex items-center justify-center shadow-sm">
                    All
                </button>
                <div className="flex-1">
                    <FilterTabs currentFilter={currentFilter} onFilterChange={setCurrentFilter} />
                </div>
            </div>

            <div className="border-t border-gray-100 my-1"></div>

            <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-sm">
                    {currentFilter === 'all' ? 'Upcoming' :
                        currentFilter === 'today' ? 'Today' :
                            currentFilter === 'week' ? 'This Week' : 'This Month'}
                </h3>
            </div>

            <div className="flex-1 min-h-0 relative overflow-y-auto">
                <UpcomingList contests={filteredContests} isLoading={loading} />
            </div>
        </div>
    );
}

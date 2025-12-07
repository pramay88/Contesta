import React from 'react';
import { Contest } from '@/app/contests/constants';
import { PlatformFilter } from './PlatformFilter';
import { UpcomingList } from './UpcomingList';

interface ContestsSidebarProps {
    search: string;
    onSearchChange: (value: string) => void;
    selectedPlatforms: string[];
    onPlatformChange: (platform: string) => void;
    upcomingContests: Contest[];
    loading: boolean;
    error: string;
}

export function ContestsSidebar({
    search,
    onSearchChange,
    selectedPlatforms,
    onPlatformChange,
    upcomingContests,
    loading,
    error,
}: ContestsSidebarProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-5 flex flex-col gap-3 h-full">
            <div className="mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Contests Calendar</h1>
                <p className="text-xs sm:text-sm text-gray-600">Track coding contests across platforms</p>
            </div>

            <input
                type="text"
                placeholder="Search Contests"
                className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                disabled={loading}
            />

            <PlatformFilter
                selectedPlatforms={selectedPlatforms}
                onPlatformChange={onPlatformChange}
                isLoading={loading}
            />

            <div className="border-t pt-3">
                <h2 className="text-base sm:text-lg font-bold mb-1 text-gray-900">Upcoming Contests</h2>
                <p className="text-xs text-gray-500 mb-3">Don't miss scheduled events</p>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-xs sm:text-sm mb-3">
                        {error}
                    </div>
                )}

                <UpcomingList contests={upcomingContests} isLoading={loading} />
            </div>
        </div>
    );
}
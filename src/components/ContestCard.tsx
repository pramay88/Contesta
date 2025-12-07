import React from 'react';
import { format } from 'date-fns';
import { FaCalendarDays } from 'react-icons/fa6';
import { Contest } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';

interface ContestCardProps {
    contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
    return (
        <div
            className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-3 flex flex-col gap-2 border-l-4 hover:shadow-md transition-shadow"
            style={{ borderColor: '#2563eb' }}
        >
            <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center rounded-full bg-white border shadow-sm w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                    <PlatformIcon resource={contest.resource} />
                </span>
                <span className="font-medium text-sm sm:text-base flex-1 truncate">
                    {contest.event}
                </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-600">
                {format(new Date(contest.start), 'dd-MM-yyyy hh:mm a')} -{' '}
                {format(new Date(contest.end), 'hh:mm a')}
            </div>

            <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
                <a
                    href={contest.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-xs sm:text-sm hover:underline flex items-center gap-1 font-medium"
                >
                    Open <span>↗</span>
                </a>
                <a
                    href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.event)}&dates=${format(new Date(contest.start), "yyyyMMdd'T'HHmmss")}/${format(new Date(contest.end), "yyyyMMdd'T'HHmmss")}&details=${encodeURIComponent(contest.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-1"
                >
                    <FaCalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="hidden sm:inline">Add to Calendar</span>
                    <span className="sm:hidden">Add</span>
                </a>
            </div>
        </div>
    );
}
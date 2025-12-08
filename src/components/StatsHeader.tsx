import React from 'react';
import { BsClockHistory, BsCalendarEvent, BsGraphUp } from 'react-icons/bs';

interface StatsHeaderProps {
    todayCount: number;
    weekCount: number;
    upcomingCount: number;
}

export function StatsHeader({ todayCount, weekCount, upcomingCount }: StatsHeaderProps) {
    return (
        <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-purple-600 font-medium">
                <BsClockHistory className="w-3.5 h-3.5" />
                <span>{todayCount} Today</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                <BsCalendarEvent className="w-3.5 h-3.5" />
                <span>{weekCount} Week</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 font-medium">
                <BsGraphUp className="w-3.5 h-3.5" />
                <span>{upcomingCount} Total</span>
            </div>
        </div>
    );
}

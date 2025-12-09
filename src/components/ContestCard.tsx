import React, { useState } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar, ExternalLink, CalendarPlus } from 'lucide-react';
import { Contest } from '@/app/contests/constants';
import { PlatformIcon } from "./PlatformIcon";

interface ContestCardProps {
    contest: Contest;
}

// Platform color mappings
const platformColors: Record<string, { bg: string; text: string; lightBg: string }> = {
    codeforces: { bg: 'bg-blue-500', text: 'text-blue-700', lightBg: 'bg-blue-50' },
    leetcode: { bg: 'bg-orange-500', text: 'text-orange-700', lightBg: 'bg-orange-50' },
    codechef: { bg: 'bg-amber-600', text: 'text-amber-700', lightBg: 'bg-amber-50' },
    atcoder: { bg: 'bg-gray-700', text: 'text-gray-700', lightBg: 'bg-gray-50' },
    hackerrank: { bg: 'bg-green-600', text: 'text-green-700', lightBg: 'bg-green-50' },
    topcoder: { bg: 'bg-red-500', text: 'text-red-700', lightBg: 'bg-red-50' },
};

// Helper function to format date for calendar exports
const formatDateForCalendar = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
};

// Generate Google Calendar URL
const generateGoogleCalendarUrl = (contest: Contest): string => {
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: contest.event,
        dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
        details: `Contest on ${contest.resource}\\n\\nLink: ${contest.href}`,
        location: contest.resource,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Generate iCal file content for Apple Calendar
const generateICalFile = (contest: Contest): void => {
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    const icalContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Contesta.io//Contest Calendar//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateForCalendar(startDate)}`,
        `DTEND:${formatDateForCalendar(endDate)}`,
        `SUMMARY:${contest.event}`,
        `DESCRIPTION:Contest on ${contest.resource}\\\\n\\\\nLink: ${contest.href}`,
        `LOCATION:${contest.resource}`,
        `URL:${contest.href}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\\r\\n');

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${contest.event.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export function ContestCard({ contest }: ContestCardProps) {
    const [showCalendarMenu, setShowCalendarMenu] = useState(false);

    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);
    const now = new Date();

    // Get platform colors
    const platformKey = contest.resource.toLowerCase().replace(/\s+/g, '');
    const colors = platformColors[platformKey] || { bg: 'bg-purple-600', text: 'text-purple-700', lightBg: 'bg-purple-50' };

    // Format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Format duration
    const formatDuration = (start: Date, end: Date) => {
        const minutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    // Get time until contest
    const getTimeUntil = () => {
        const diff = startDate.getTime() - now.getTime();

        if (diff < 0) {
            // Check if contest is live
            if (now < endDate) {
                return 'LIVE';
            }
            return 'Ended';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `in ${days}d ${hours}h`;
        if (hours > 0) return `in ${hours}h ${minutes}m`;
        return `in ${minutes}m`;
    };

    const timeUntil = getTimeUntil();
    const isLive = timeUntil === 'LIVE';

    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${colors.lightBg} bg-opacity-30 relative`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold text-white ${colors.bg} flex items-center gap-1`}>
                            <PlatformIcon resource={contest.resource} className="w-2.5 h-2.5" />
                            {contest.resource}
                        </span>
                        {isLive ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                {timeUntil}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-500">{timeUntil}</span>
                        )}
                    </div>

                    <h3 className="text-gray-900 mb-3 font-medium text-sm leading-tight">{contest.event}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(startDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Duration: {formatDuration(startDate, endDate)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                    <a
                        href={contest.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Open contest"
                    >
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                    </a>

                    {/* Add to Calendar */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                            onBlur={() => setTimeout(() => setShowCalendarMenu(false), 200)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Add to Calendar"
                        >
                            <CalendarPlus className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Dropdown Menu */}
                        {showCalendarMenu && (
                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                <button
                                    onClick={() => {
                                        window.open(generateGoogleCalendarUrl(contest), '_blank');
                                        setShowCalendarMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" />
                                    </svg>
                                    <span>Google Calendar</span>
                                </button>
                                <button
                                    onClick={() => {
                                        generateICalFile(contest);
                                        setShowCalendarMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    <span>Apple Calendar</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
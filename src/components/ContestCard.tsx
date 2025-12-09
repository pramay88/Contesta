import React, { useState } from 'react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { BsBoxArrowUpRight, BsCalendarPlus, BsApple, BsGoogle } from 'react-icons/bs';
import { HiOutlineCalendar, HiOutlineClock } from 'react-icons/hi';
import { Contest } from '@/app/contests/constants';
import { PlatformIcon } from "./PlatformIcon"
interface ContestCardProps {
    contest: Contest;
}

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
        details: `Contest on ${contest.resource}\n\nLink: ${contest.href}`,
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
        `DESCRIPTION:Contest on ${contest.resource}\\n\\nLink: ${contest.href}`,
        `LOCATION:${contest.resource}`,
        `URL:${contest.href}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

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

    // Determine status text
    let statusText = '';
    let statusColor = 'text-gray-500';
    let isLive = false;

    if (now > startDate && now < endDate) {
        statusText = 'LIVE';
        statusColor = 'text-red-600 font-bold';
        isLive = true;
    } else if (now < startDate) {
        statusText = `in ${formatDistanceToNow(startDate)}`;
        statusColor = 'text-gray-500';
    } else {
        statusText = 'Ended';
        statusColor = 'text-gray-400';
    }

    // Platform pill color (simplified mapping)
    const getPlatformColor = (resource: string) => {
        const r = resource.toLowerCase();
        if (r.includes('codeforces')) return 'bg-blue-600';
        if (r.includes('leetcode')) return 'bg-orange-500';
        if (r.includes('codechef')) return 'bg-amber-700';
        if (r.includes('atcoder')) return 'bg-neutral-800';
        return 'bg-purple-600';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 mb-2.5 hover:shadow-md transition-shadow relative">
            {/* Header Row: Platform Pill + Status */}
            <div className="flex items-center gap-2 mb-2">


                <span
                    className={`${getPlatformColor(contest.resource)} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1`}
                >
                    <PlatformIcon resource={contest.resource} className="w-2.5 h-2.5" />
                    {contest.resource}
                </span>

                {isLive ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-red-600">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        {statusText}
                    </span>
                ) : (
                    <span className={`text-xs ${statusColor}`}>
                        {statusText}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="text-gray-900 font-medium text-sm mb-2 pr-8 leading-tight">
                {contest.event}
            </h3>

            {/* Metadata Row */}
            <div className="flex items-center gap-3 text-gray-500 text-xs">
                <div className="flex items-center gap-1.5">
                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                    <span>{format(startDate, 'MMM d')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    <span>{format(startDate, 'p')}</span>
                </div>
            </div>

            {/* External Link (Absolute positioned top-right) */}
            <a
                href={contest.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
            >
                <BsBoxArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Add to Calendar (Absolute positioned below external link) */}
            <div className="absolute top-10 right-3">
                <button
                    onClick={() => setShowCalendarMenu(!showCalendarMenu)}
                    onBlur={() => setTimeout(() => setShowCalendarMenu(false), 200)}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
                    title="Add to Calendar"
                >
                    <BsCalendarPlus className="w-3.5 h-3.5" />
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
                            <BsGoogle className="w-4 h-4 text-blue-600" />
                            <span>Google Calendar</span>
                        </button>
                        <button
                            onClick={() => {
                                generateICalFile(contest);
                                setShowCalendarMenu(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <BsApple className="w-4 h-4 text-gray-700" />
                            <span>Apple Calendar</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
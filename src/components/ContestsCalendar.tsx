'use client';

import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { CalendarEvent } from './CalendarEvent';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
    getDay,
    locales,
});

interface CalendarEventData {
    id: number;
    title: string;
    start: Date;
    end: Date;
    resource: string;
    url: string;
    allDay: boolean;
    bgColor: string;
}

interface ContestsCalendarProps {
    events: CalendarEventData[];
    loading: boolean;
    currentMonth: string;
}

export function ContestsCalendar({ events, loading, currentMonth }: ContestsCalendarProps) {
    const [date, setDate] = useState(new Date());

    if (loading) {
        return (
            <div className="w-full h-[400px] sm:h-[500px] md:h-[520px] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
                <p className="text-gray-400 text-sm sm:text-base">Loading calendar...</p>
            </div>
        );
    }

    return (
        <div className="w-full calendar-responsive" style={{ minWidth: 0 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                className="text-xs sm:text-sm"
                style={{ height: 'clamp(400px, 60vh, 520px)', minWidth: 0 }}
                popup
                views={['month', 'week', 'day', 'agenda']}
                components={{ event: CalendarEvent }}
                eventPropGetter={(event: any) => ({
                    style: {
                        backgroundColor: event.bgColor,
                        color: '#fff',
                        borderRadius: '4px',
                        border: 'none',
                        padding: '1px 3px',
                        minWidth: 0,
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
                        lineHeight: '1.2',
                        display: 'block',
                    },
                })}
                onSelectEvent={(event: any) => {
                    if (event.url) window.open(event.url, '_blank');
                }}
            />
        </div>
    );
}
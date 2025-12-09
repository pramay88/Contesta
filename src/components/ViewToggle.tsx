import React from 'react';
import { Calendar, dateFnsLocalizer, ToolbarProps } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { CalendarEvent } from './CalendarEvent';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

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
    currentDate: Date;
    onNavigate: (date: Date) => void;
    selectedDate?: Date | null;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

// Custom Toolbar
const CustomToolbar = (toolbar: ToolbarProps) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    return (
        <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {format(toolbar.date, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={goToBack}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Previous month"
                >
                    <BsChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={goToNext}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Next month"
                >
                    <BsChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export function ContestsCalendar({
    events,
    loading,
    currentDate,
    onNavigate,
    selectedDate,
    onSelectSlot
}: ContestsCalendarProps) {
    if (loading) {
        return (
            <div className="w-full h-[400px] sm:h-[500px] bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
                <p className="text-gray-400 font-medium text-sm sm:text-base">Loading calendar...</p>
            </div>
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="w-full h-full bg-white relative p-1 sm:p-2">
            <style>{`
                .rbc-calendar { 
                    font-family: inherit;
                    min-height: 400px;
                }
                .rbc-month-view { 
                    border: none;
                    overflow: auto;
                }
                .rbc-header {
                    border-bottom: none;
                    text-transform: uppercase;
                    font-size: 0.65rem;
                    font-weight: 500;
                    color: #6b7280;
                    padding: 6px 4px;
                }
                @media (min-width: 640px) {
                    .rbc-header {
                        font-size: 0.75rem;
                        padding: 8px 6px;
                    }
                }
                .rbc-day-bg { 
                    border-left: none;
                    min-height: 60px;
                }
                @media (min-width: 640px) {
                    .rbc-day-bg {
                        min-height: 80px;
                    }
                }
                @media (min-width: 1024px) {
                    .rbc-day-bg {
                        min-height: 100px;
                    }
                }
                .rbc-off-range-bg { background: transparent; }
                .rbc-month-row { 
                    border-top: none;
                    min-height: 60px;
                }
                @media (min-width: 640px) {
                    .rbc-month-row {
                        min-height: 80px;
                    }
                }
                @media (min-width: 1024px) {
                    .rbc-month-row {
                        min-height: 100px;
                    }
                }
                .rbc-date-cell { 
                    padding: 4px;
                    font-size: 0.75rem;
                    color: #374151;
                    font-weight: 500;
                }
                @media (min-width: 640px) {
                    .rbc-date-cell {
                        padding: 6px;
                        font-size: 0.875rem;
                    }
                }
                @media (min-width: 1024px) {
                    .rbc-date-cell {
                        padding: 8px;
                    }
                }
                .rbc-day-bg + .rbc-day-bg { 
                    border-left: 1px solid #f3f4f6;
                }
                .rbc-month-row + .rbc-month-row { 
                    border-top: 1px solid #f3f4f6;
                }
                .rbc-today { 
                    background-color: transparent;
                }
                .rbc-event {
                    padding: 1px 2px !important;
                }
                @media (min-width: 640px) {
                    .rbc-event {
                        padding: 2px 4px !important;
                    }
                }
                .rbc-event-content {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .rbc-show-more {
                    font-size: 0.65rem;
                    margin: 2px;
                    color: #6b7280;
                }
                @media (min-width: 640px) {
                    .rbc-show-more {
                        font-size: 0.7rem;
                    }
                }
            `}</style>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                date={currentDate}
                onNavigate={onNavigate}
                selectable
                onSelectSlot={onSelectSlot}
                className="font-sans"
                style={{
                    height: '100%',
                    minHeight: '400px',
                    maxHeight: '600px'
                }}
                views={['month']}
                defaultView="month"
                components={{
                    event: CalendarEvent,
                    toolbar: CustomToolbar,
                }}
                dayPropGetter={(date: Date) => {
                    const dateOnly = new Date(date);
                    dateOnly.setHours(0, 0, 0, 0);

                    const isToday = dateOnly.getTime() === today.getTime();
                    const isSelected = selectedDate &&
                        new Date(selectedDate.setHours(0, 0, 0, 0)).getTime() === dateOnly.getTime();

                    const style: React.CSSProperties = {
                        backgroundColor: 'white',
                        margin: '2px',
                        borderRadius: '8px',
                        border: '1px solid #f3f4f6',
                    };

                    if (isSelected) {
                        style.border = '2px solid #8b5cf6';
                        style.backgroundColor = '#f5f3ff';
                    } else if (isToday) {
                        style.border = '2px solid #3b82f6';
                        style.backgroundColor = '#eff6ff';
                    }

                    return { style };
                }}
                eventPropGetter={(event: any) => ({
                    style: {
                        backgroundColor: event.bgColor,
                        color: '#fff',
                        fontSize: '0.65rem',
                        borderRadius: '4px',
                        border: 'none',
                        padding: '1px 2px',
                        marginBottom: '1px',
                        display: 'block',
                        opacity: 0.9,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    },
                })}
                onSelectEvent={(event: any) => {
                    if (event.url) window.open(event.url, '_blank');
                }}
            />
        </div>
    );
}
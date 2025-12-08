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
            <h2 className="text-lg font-semibold text-gray-800">
                {format(toolbar.date, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={goToBack}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                    <BsChevronLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={goToNext}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
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
            <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
                <p className="text-gray-400 font-medium">Loading calendar...</p>
            </div>
        );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="w-full h-full bg-white relative p-2">
            <style>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-month-view { border: none; }
                .rbc-header {
                    border-bottom: none;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6b7280;
                    padding-bottom: 10px;
                }
                .rbc-day-bg { border-left: none; }
                .rbc-off-range-bg { background: transparent; }
                .rbc-month-row { border-top: none; min-height: 100px; }
                .rbc-date-cell { 
                    padding: 8px; 
                    font-size: 0.875rem; 
                    color: #374151;
                    font-weight: 500;
                }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f3f4f6; } /* Vertical dividers */
                .rbc-month-row + .rbc-month-row { border-top: 1px solid #f3f4f6; } /* Horizontal dividers */
                .rbc-today { background-color: transparent; } /* Handle today via prop getter for custom look */
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
                style={{ height: 'calc(100vh - 220px)', maxHeight: 550 }}
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
                        margin: '4px',
                        borderRadius: '12px',
                        border: '1px solid #f3f4f6', // Light gray border for all
                    };

                    if (isSelected) {
                        style.border = '2px solid #8b5cf6'; // Purple Focus
                        style.backgroundColor = '#f5f3ff';
                    } else if (isToday) {
                        style.border = '2px solid #3b82f6'; // Blue Today
                        style.backgroundColor = '#eff6ff';
                    }

                    return { style };
                }}
                eventPropGetter={(event: any) => ({
                    style: {
                        backgroundColor: event.bgColor,
                        color: event.resource.toLowerCase().includes('leetcode') ? '#fff' : '#fff', // Adjust contrast if needed
                        fontSize: '0.7rem',
                        borderRadius: '4px',
                        border: 'none',
                        padding: '2px 4px',
                        marginBottom: '2px',
                        display: 'block',
                        opacity: 0.9,
                    },
                })}
                onSelectEvent={(event: any) => {
                    if (event.url) window.open(event.url, '_blank');
                }}
            />
        </div>
    );
}
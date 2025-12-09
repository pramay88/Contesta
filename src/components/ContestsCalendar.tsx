import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
    events: Array<{
        id: number;
        title: string;
        start: Date;
        end: Date;
        resource: string;
        url: string;
        bgColor: string;
    }>;
    loading: boolean;
    currentDate: Date;
    onNavigate: (date: Date) => void;
    selectedDate?: Date | null;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

export function ContestsCalendar({
    events,
    loading,
    currentDate,
    onNavigate,
    selectedDate,
    onSelectSlot
}: CalendarViewProps) {
    if (loading) {
        return (
            <div className="w-full h-[500px] bg-gray-50 rounded-xl animate-pulse flex items-center justify-center">
                <p className="text-gray-400 font-medium">Loading calendar...</p>
            </div>
        );
    }

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const getEventsForDay = (date: Date) => {
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return events.filter(event => {
            const eventStart = new Date(event.start);
            return eventStart >= dayStart && eventStart <= dayEnd;
        });
    };

    const previousMonth = () => {
        onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        onNavigate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const isToday = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate.getTime() === today.getTime();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);
        const checkDate = new Date(date);
        checkDate.setHours(0, 0, 0, 0);
        return checkDate.getTime() === selected.getTime();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const handleDayClick = (date: Date) => {
        if (onSelectSlot) {
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);
            onSelectSlot({ start: dayStart, end: dayEnd });
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={previousMonth}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Next month"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-3">
                {/* Day names header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-gray-600 text-xs font-medium uppercase py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        const dayEvents = getEventsForDay(day);
                        const today = isToday(day);
                        const selected = isSelected(day);
                        const currentMonth = isCurrentMonth(day);

                        return (
                            <div
                                key={index}
                                onClick={() => handleDayClick(day)}
                                className={`min-h-24 p-2 rounded-lg border cursor-pointer transition-all ${selected
                                        ? 'ring-2 ring-purple-500 bg-purple-50 border-purple-200'
                                        : today
                                            ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                                            : currentMonth
                                                ? 'bg-white border-gray-200 hover:bg-gray-50'
                                                : 'bg-gray-50 border-gray-100'
                                    }`}
                            >
                                <div
                                    className={`text-sm font-medium mb-1 ${today
                                            ? 'w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs'
                                            : selected
                                                ? 'w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs'
                                                : currentMonth
                                                    ? 'text-gray-900'
                                                    : 'text-gray-400'
                                        }`}
                                >
                                    {day.getDate()}
                                </div>
                                <div className="space-y-1">
                                    {dayEvents.slice(0, 2).map(event => (
                                        <div
                                            key={event.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (event.url) window.open(event.url, '_blank');
                                            }}
                                            className="text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                                            style={{ backgroundColor: event.bgColor, color: '#fff' }}
                                            title={event.title}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className="text-xs text-gray-500 px-1.5">
                                            +{dayEvents.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {events.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                    No contests found
                </div>
            )}
        </div>
    );
}
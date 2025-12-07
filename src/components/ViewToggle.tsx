import React from 'react';
import { FaList, FaCalendar } from 'react-icons/fa6';

interface ViewToggleProps {
    view: 'list' | 'calendar';
    onViewChange: (view: 'list' | 'calendar') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center justify-center gap-2 mb-4 md:hidden bg-white rounded-lg shadow p-1">
            <button
                onClick={() => onViewChange('calendar')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all font-medium text-sm ${view === 'calendar'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                <FaCalendar className="w-4 h-4" />
                <span>Calendar</span>
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md transition-all font-medium text-sm ${view === 'list'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                <FaList className="w-4 h-4" />
                <span>List</span>
            </button>
        </div>
    );
}

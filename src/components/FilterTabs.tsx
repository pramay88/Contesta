import React from 'react';

interface FilterTabsProps {
    currentFilter: 'all' | 'today' | 'week' | 'month';
    onFilterChange: (filter: 'all' | 'today' | 'week' | 'month') => void;
}

export function FilterTabs({ currentFilter, onFilterChange }: FilterTabsProps) {
    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'Week' },
        { id: 'month', label: 'Month' },
    ] as const;

    return (
        <div className="flex bg-gray-100 p-0.5 rounded-lg">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onFilterChange(tab.id)}
                    className={`
                        flex-1 text-xs font-medium py-1 px-2 rounded-md transition-all
                        ${currentFilter === tab.id
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                        }
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

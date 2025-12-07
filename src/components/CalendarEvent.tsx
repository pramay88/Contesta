import React from 'react';
import { EventProps } from 'react-big-calendar';
import { PlatformIcon } from './PlatformIcon';

export function CalendarEvent({ event }: EventProps<any>) {
    const resource = event.resource?.toLowerCase();

    return (
        <span className="flex items-center gap-1 w-full overflow-hidden" style={{ maxWidth: '100%' }}>
            <span className="inline-flex items-center justify-center rounded-full bg-white border shadow-sm w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                <PlatformIcon resource={resource} className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
            <span className="truncate font-medium text-[0.65rem] sm:text-xs leading-tight flex-1 min-w-0">
                {event.title}
            </span>
        </span>
    );
}
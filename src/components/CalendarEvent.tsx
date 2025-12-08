import React from 'react';
import { EventProps } from 'react-big-calendar';
import { PlatformIcon } from './PlatformIcon';

export function CalendarEvent({ event }: EventProps<any>) {
    const resource = event.resource?.toLowerCase();

    return (
        <span className="flex items-center gap-1.5 w-full overflow-hidden h-full">
            <span className="inline-flex items-center justify-center rounded-full bg-white/90 shadow-sm w-4 h-4 flex-shrink-0">
                <PlatformIcon resource={resource} className="w-2.5 h-2.5" />
            </span>
            <span className="truncate font-semibold text-[0.65rem] leading-tight flex-1 opacity-95">
                {event.title}
            </span>
        </span>
    );
}
declare module 'react-big-calendar' {
    import * as React from 'react';

    export interface EventProps<TEvent = any> {
        event: TEvent;
    }

    export const Calendar: any;
}
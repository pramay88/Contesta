import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Contest } from '@/app/contests/constants';
import { ContestCard } from './ContestCard';
import { SkeletonDateGroup } from './SkeletonLoaders';

interface UpcomingListProps {
    contests: Contest[];
    isLoading: boolean;
}

export function UpcomingList({ contests, isLoading }: UpcomingListProps) {
    const groupedContests = useMemo(() => {
        const groups: Record<string, Contest[]> = {};
        contests.forEach((c) => {
            const dateKey = format(new Date(c.start), 'yyyy-MM-dd');
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(c);
        });
        return groups;
    }, [contests]);

    if (isLoading) {
        return (
            <div className="overflow-y-auto max-h-[60vh] md:max-h-[65vh] pr-1 sm:pr-2">
                <SkeletonDateGroup />
                <SkeletonDateGroup />
            </div>
        );
    }

    if (Object.keys(groupedContests).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500">
                <h2 className="text-base font-semibold text-gray-700">
                    😌 Looks like you’ve got a chill one.
                </h2>

                <p className="text-sm mt-1 text-gray-500">
                    No contests on this day.
                </p>
            </div>




        );
    }

    return (
        <div className="overflow-y-auto h-full pr-1 sm:pr-2">
            {Object.keys(groupedContests)
                .sort()
                .map((dateKey) => (
                    <div key={dateKey} className="mb-5">
                        <div className="text-xs sm:text-sm text-gray-600 mb-2 font-semibold">
                            {format(new Date(dateKey), 'PPP')}
                        </div>
                        {groupedContests[dateKey].map((contest, idx) => (
                            <ContestCard key={`${dateKey}-${idx}`} contest={contest} />
                        ))}
                    </div>
                ))}
        </div>
    );
}
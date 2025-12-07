import React from 'react';

export function SkeletonContestCard() {
    return (
        <div className="bg-white rounded shadow p-3 mb-3 border-l-4 border-gray-200">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded mb-2 w-1/2 animate-pulse"></div>
            <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded flex-1 animate-pulse"></div>
            </div>
        </div>
    );
}

export function SkeletonDateGroup() {
    return (
        <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3 animate-pulse"></div>
            <SkeletonContestCard />
            <SkeletonContestCard />
            <SkeletonContestCard />
        </div>
    );
}
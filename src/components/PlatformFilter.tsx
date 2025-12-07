import React from 'react';
import { PLATFORM_OPTIONS } from '@/app/contests/constants';

interface PlatformFilterProps {
    selectedPlatforms: string[];
    onPlatformChange: (platform: string) => void;
    isLoading: boolean;
}

export function PlatformFilter({
    selectedPlatforms,
    onPlatformChange,
    isLoading,
}: PlatformFilterProps) {
    return (
        <select
            className="w-full p-2.5 sm:p-3 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50 bg-white"
            value={selectedPlatforms[0] || ''}
            onChange={(e) => onPlatformChange(e.target.value)}
            disabled={isLoading}
        >
            <option value="">All Platforms</option>
            {PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
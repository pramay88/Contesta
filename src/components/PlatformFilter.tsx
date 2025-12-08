import React, { useState, useRef, useEffect } from 'react';
import { PLATFORM_OPTIONS } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';
import { BsChevronDown, BsX, BsCheck } from 'react-icons/bs';

interface PlatformFilterProps {
    selectedPlatforms: string[];
    onPlatformChange: (platform: string) => void; // Keeping signature but will handle multi-select logic internally or request prop change if needed. 
    // Wait, the parent expects single platform string?
    // Looking at ContestsPage.tsx usage: `onPlatformChange={(p) => setSelectedPlatforms(p ? [p] : [])}`.
    // The previous implementation was single select.
    // The new design implies multi-select.
    // I need to update the prop signature to accept string[] or change logic to support multi-select update.
    // Let's change the prop to `onSelectionChange: (platforms: string[]) => void` efficiently.
    // For now, I'll adapt to existing signature or better, change the component to handle the array update logic and pass it up.
    // Actually, I can just overload or genericize, but let's see. Parent `setSelectedPlatforms` is passed.
    // I should probably update the parent to handle multi-select logic properly if it doesn't already.
    // In `page.tsx`: 
    // `const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);` 
    // The hook `useContests` had `selectedPlatforms` and `setSelectedPlatforms`.
    // So multi-select IS supported by the state, but the previous UI was single select.

    // I will modify the prop to be `onUpdate: (platforms: string[]) => void`.
    // But to minimize breakage, I will check the usage.
    // The usage in `page.tsx` was: `onPlatformChange={(p) => setSelectedPlatforms(p ? [p] : [])}`
    // This forced single select. I should update `page.tsx` as well to verify it works.
}

// Updated props for multi-select
interface NewPlatformFilterProps {
    selectedPlatforms: string[];
    onPlatformChange: (platforms: string[]) => void;
    isLoading: boolean;
}

export function PlatformFilter({
    selectedPlatforms,
    onPlatformChange,
    isLoading,
}: NewPlatformFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePlatform = (value: string) => {
        if (selectedPlatforms.includes(value)) {
            onPlatformChange(selectedPlatforms.filter(p => p !== value));
        } else {
            onPlatformChange([...selectedPlatforms, value]);
        }
    };

    const removePlatform = (value: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onPlatformChange(selectedPlatforms.filter(p => p !== value));
    };

    const handleSelectAll = () => {
        onPlatformChange(PLATFORM_OPTIONS.map(o => o.value));
    };

    const handleClear = () => {
        onPlatformChange([]);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {/* Trigger Button */}
            <button
                onClick={() => !isLoading && setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between p-2.5 rounded-lg border bg-white transition-all
                    ${isOpen ? 'border-purple-500 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                disabled={isLoading}
            >
                <span className="text-sm text-gray-700 truncate font-medium">
                    {selectedPlatforms.length === 0 ? 'All platforms' :
                        selectedPlatforms.length === 1 ? PLATFORM_OPTIONS.find(o => o.value === selectedPlatforms[0])?.label :
                            `${selectedPlatforms.length} platforms selected`}
                </span>
                <BsChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[400px]">
                    {/* Selected Chips Area */}
                    {selectedPlatforms.length > 0 ? (
                        <div className="p-3 border-b border-gray-50 flex flex-wrap gap-2 max-h-[120px] overflow-y-auto bg-gray-50/50">
                            {selectedPlatforms.map(value => {
                                const option = PLATFORM_OPTIONS.find(o => o.value === value);
                                return (
                                    <span
                                        key={value}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-gray-200 shadow-sm text-gray-700"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> {/* Dot indicator, simplified color */}
                                        {option?.label}
                                        <button
                                            onClick={(e) => removePlatform(value, e)}
                                            className="text-gray-400 hover:text-red-500 ml-1"
                                        >
                                            <BsX className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-3 border-b border-gray-50 bg-gray-50/30 text-xs text-gray-500 text-center">
                            No platforms selected (showing all)
                        </div>
                    )}

                    {/* Actions Row */}
                    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Platforms</span>
                        <div className="flex gap-3">
                            <button onClick={handleSelectAll} className="text-xs font-medium text-purple-600 hover:text-purple-700">
                                Select All
                            </button>
                            <button onClick={handleClear} className="text-xs font-medium text-gray-500 hover:text-gray-700">
                                Clear
                            </button>
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="overflow-y-auto p-2">
                        {PLATFORM_OPTIONS.map((option) => {
                            const isSelected = selectedPlatforms.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    onClick={() => togglePlatform(option.value)}
                                    className="flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer group transition-colors"
                                >
                                    {/* Checkbox */}
                                    <div className={`
                                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                                        ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white group-hover:border-gray-400'}
                                    `}>
                                        {isSelected && <BsCheck className="w-4 h-4 text-white" />}
                                    </div>

                                    {/* Icon */}
                                    <PlatformIcon resource={option.value} className="w-5 h-5 opacity-80" />

                                    {/* Label */}
                                    <span className={`text-sm ${isSelected ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                        {option.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
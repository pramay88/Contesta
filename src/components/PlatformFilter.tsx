import React, { useState, useRef, useEffect } from 'react';
import { PLATFORM_OPTIONS, DifficultyFilter } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import { getPlatformColor } from '@/lib/platforms';

interface PlatformFilterProps {
    selectedPlatforms: string[];
    onPlatformChange: (platforms: string[]) => void;
    difficultyFilter: DifficultyFilter;
    onDifficultyChange: (value: DifficultyFilter) => void;
    isLoading: boolean;
}

const DIFFICULTY_OPTIONS: { key: DifficultyFilter; label: string }[] = [
    { key: 'all', label: 'All Difficulty' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'mixed', label: 'Mixed' },
    { key: 'unknown', label: 'Unknown' },
];

export function PlatformFilter({ selectedPlatforms, onPlatformChange, difficultyFilter, onDifficultyChange, isLoading }: PlatformFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (value: string) => {
        if (isLoading) return;
        onPlatformChange(
            selectedPlatforms.includes(value)
                ? selectedPlatforms.filter(p => p !== value)
                : [...selectedPlatforms, value]
        );
    };

    const clearAll = () => {
        if (!isLoading) {
            onPlatformChange([]);
            onDifficultyChange('all');
        }
    };
    const activeCount = selectedPlatforms.length + (difficultyFilter !== 'all' ? 1 : 0);

    return (
        <div className="relative" ref={ref}>
            {/* Trigger */}
            <button
                onClick={() => !isLoading && setIsOpen(v => !v)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                style={{
                    fontFamily: 'var(--font-jetbrains-mono), monospace',
                    background: isOpen || activeCount > 0 ? 'var(--accent-light)' : 'var(--bg-card)',
                    borderColor: isOpen || activeCount > 0 ? 'var(--accent)' : 'var(--border)',
                    color: isOpen || activeCount > 0 ? 'var(--accent)' : 'var(--text-secondary)',
                }}
            >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold text-white"
                        style={{ background: 'var(--accent)' }}>
                        {activeCount}
                    </span>
                )}
            </button>

            {/* Dropdown — right-aligned to stay on screen */}
            {isOpen && (
                <div
                    className="absolute top-full right-0 mt-2 w-60 rounded-2xl overflow-hidden z-50"
                    style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-md)',
                    }}
                >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-card-hover)' }}>
                        <span className="text-[11px] font-bold tracking-wider"
                            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-muted)' }}>
                            GLOBAL FILTERS
                        </span>
                        {activeCount > 0 && (
                            <button onClick={clearAll}
                                className="flex items-center gap-0.5 text-[11px] font-semibold"
                                style={{ color: 'var(--accent)' }}>
                                <X className="w-3 h-3" /> Clear
                            </button>
                        )}
                    </div>

                    {/* Options */}
                    <div className="p-1.5 flex flex-col gap-0.5 max-h-72 overflow-y-auto">
                        {PLATFORM_OPTIONS.map(opt => {
                            const isActive = selectedPlatforms.includes(opt.value);
                            const color = getPlatformColor(opt.value);
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => toggle(opt.value)}
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer transition-all"
                                    style={{ background: isActive ? `${color}14` : 'transparent' }}
                                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--border-subtle)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = isActive ? `${color}14` : 'transparent'; }}
                                >
                                    {/* Checkbox */}
                                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                                        style={{ borderColor: isActive ? color : 'var(--border)', background: isActive ? color : 'transparent' }}>
                                        {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <PlatformIcon resource={opt.value} className="w-3.5 h-3.5 shrink-0" />
                                    <span className="text-xs font-medium"
                                        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif' }}>
                                        {opt.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="mb-2 text-xs font-bold text-gray-500" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                            Difficulty
                        </div>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => onDifficultyChange(e.target.value as DifficultyFilter)}
                            className="w-full px-2 py-2 text-xs rounded-lg border"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        >
                            {DIFFICULTY_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
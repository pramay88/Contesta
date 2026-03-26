import React, { useState, useRef, useEffect } from 'react';
import { PLATFORM_OPTIONS, DifficultyFilter, DurationFilter } from '@/app/contests/constants';
import { PlatformIcon } from './PlatformIcon';
import { SlidersHorizontal, Check, X } from 'lucide-react';

interface PlatformFilterProps {
    selectedPlatforms: string[];
    onPlatformChange: (platforms: string[]) => void;
    difficultyFilter: DifficultyFilter;
    onDifficultyChange: (value: DifficultyFilter) => void;
    durationFilter: DurationFilter;
    onDurationChange: (value: DurationFilter) => void;
    isLoading: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
    'leetcode.com': '#f89f1b',
    'codeforces.com': '#3b82f6',
    'codechef.com': '#7c3aed',
    'atcoder.jp': '#0ea5e9',
    'hackerrank.com': '#22c55e',
    'hackerearth.com': '#6366f1',
    'geeksforgeeks.org': '#16a34a',
    'kaggle.com': '#06b6d4',
    'topcoder.com': '#ef4444',
    'interviewbit.com': '#8b5cf6',
    'codingninjas.com': '#f97316',
};

const DIFFICULTY_OPTIONS: { key: DifficultyFilter; label: string }[] = [
    { key: 'all', label: 'All Difficulty' },
    { key: 'beginner', label: 'Beginner' },
    { key: 'intermediate', label: 'Intermediate' },
    { key: 'advanced', label: 'Advanced' },
    { key: 'mixed', label: 'Mixed' },
    { key: 'unknown', label: 'Unknown' },
];

const DURATION_OPTIONS: { key: DurationFilter; label: string }[] = [
    { key: 'all', label: 'All Duration' },
    { key: 'short', label: 'Short (≤2h)' },
    { key: 'medium', label: 'Medium (2–5h)' },
    { key: 'long', label: 'Long (>5h)' },
    { key: 'unknown', label: 'Unknown' },
];

export function PlatformFilter({ selectedPlatforms, onPlatformChange, difficultyFilter, onDifficultyChange, durationFilter, onDurationChange, isLoading }: PlatformFilterProps) {
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
            onDurationChange('all');
        }
    };
    const activeCount = selectedPlatforms.length + (difficultyFilter !== 'all' ? 1 : 0) + (durationFilter !== 'all' ? 1 : 0);

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
                            const color = PLATFORM_COLORS[opt.value] ?? '#6b7280';
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
                                    <div className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                                        style={{ borderColor: isActive ? color : 'var(--border)', background: isActive ? color : 'transparent' }}>
                                        {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                                    </div>
                                    <PlatformIcon resource={opt.value} className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="text-xs font-medium"
                                        style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-inter), sans-serif' }}>
                                        {opt.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="px-3 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="mb-2 text-[11px] font-bold text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
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

                        <div className="mt-3 mb-2 text-[11px] font-bold text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-jetbrains-mono), monospace' }}>
                            Duration
                        </div>
                        <select
                            value={durationFilter}
                            onChange={(e) => onDurationChange(e.target.value as DurationFilter)}
                            className="w-full px-2 py-2 text-xs rounded-lg border"
                            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                        >
                            {DURATION_OPTIONS.map(o => (
                                <option key={o.key} value={o.key}>{o.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
}
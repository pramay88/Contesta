'use client';

import { ContestaLogo } from '@/components/ContestaLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CalendarDays, List, Search } from 'lucide-react';

interface HeaderProps {
    search: string;
    onSearchChange: (v: string) => void;
    mobileView: 'calendar' | 'list';
    onMobileViewChange: (v: 'calendar' | 'list') => void;
}

const MOBILE_VIEWS = [
    { id: 'calendar', label: 'Calendar view', icon: CalendarDays },
    { id: 'list', label: 'List view', icon: List },
] as const;

export function Header({ search, onSearchChange, mobileView, onMobileViewChange }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-(--border) bg-(--bg-header) backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 md:px-6">
                {/* Brand */}
                <div className="flex flex-shrink-0 items-center gap-2.5">
                    <ContestaLogo className="h-9 w-9" />
                    <h1 className="font-mono text-[17px] font-bold leading-none tracking-tight text-(--text-primary)">
                        Contesta<span className="text-(--accent)">.io</span>
                    </h1>
                </div>

                <div className="flex-1" />

                {/* Desktop search + theme */}
                <div className="hidden items-center gap-2 sm:flex">
                    <label className="relative block">
                        <span className="sr-only">Search contests</span>
                        <Search
                            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-(--text-muted)"
                            strokeWidth={2.5}
                        />
                        <input
                            type="text"
                            placeholder="Search contests..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-52 rounded-lg border border-(--border) bg-(--bg-card) py-2 pl-9 pr-4 text-xs text-(--text-primary) outline-none transition-colors focus:border-(--accent) md:w-64"
                        />
                    </label>
                    <ThemeToggle />
                </div>

                {/* Mobile view toggle + theme */}
                <div className="flex items-center gap-1.5 sm:hidden">
                    <ThemeToggle />
                    <div className="flex items-center gap-1 rounded-lg border border-(--border) bg-(--bg-card) p-1">
                        {MOBILE_VIEWS.map(({ id, label, icon: Icon }) => {
                            const active = mobileView === id;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    aria-label={label}
                                    aria-pressed={active}
                                    onClick={() => onMobileViewChange(id)}
                                    className={`rounded-md p-1.5 transition-colors ${active
                                            ? 'bg-(--accent) text-white'
                                            : 'text-(--text-secondary) hover:bg-(--bg-card-hover)'
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
}
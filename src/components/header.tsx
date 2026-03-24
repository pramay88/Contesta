'use client';

import { ContestaLogo } from '@/components/ContestaLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BsListUl, BsCalendar3 } from 'react-icons/bs';

interface HeaderProps {
    search: string;
    onSearchChange: (v: string) => void;
    mobileView: 'calendar' | 'list';
    onMobileViewChange: (v: 'calendar' | 'list') => void;
}

export function Header({ search, onSearchChange, mobileView, onMobileViewChange }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 backdrop-blur-md border-b"
            style={{ background: 'var(--bg-header)', borderColor: 'var(--border)' }}>
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3">
                {/* Single row: logo | spacer | search + theme | mobile toggles */}
                <div className="flex items-center gap-3">
                    {/* Logo + name */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <ContestaLogo className="w-9 h-9" />
                        <h1 className="text-[17px] font-extrabold leading-none tracking-tight"
                            style={{ fontFamily: 'var(--font-jetbrains-mono), monospace', color: 'var(--text-primary)' }}>
                            Contesta<span style={{ color: '#f97316' }}>.io</span>
                        </h1>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Desktop: Search + theme */}
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                                style={{ color: 'var(--text-muted)' }}>
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search contests..."
                                value={search}
                                onChange={e => onSearchChange(e.target.value)}
                                className="w-52 md:w-64 pl-9 pr-4 py-2 text-xs rounded-xl border outline-none transition-all"
                                style={{
                                    fontFamily: 'var(--font-inter), sans-serif',
                                    background: 'var(--bg-card)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                            />
                        </div>
                        <ThemeToggle />
                    </div>

                    {/* Mobile: view toggles + theme */}
                    <div className="flex sm:hidden items-center gap-1.5">
                        <ThemeToggle />
                        {(['calendar', 'list'] as const).map(v => (
                            <button key={v} onClick={() => onMobileViewChange(v)}
                                className="p-2 rounded-lg border"
                                style={{
                                    background: mobileView === v ? 'var(--accent)' : 'var(--bg-card)',
                                    borderColor: mobileView === v ? 'var(--accent)' : 'var(--border)',
                                    color: mobileView === v ? '#fff' : 'var(--text-secondary)',
                                }}>
                                {v === 'calendar' ? <BsCalendar3 className="w-3.5 h-3.5" /> : <BsListUl className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}

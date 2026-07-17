'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { ContestaLogo } from '@/components/ContestaLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_ITEMS = [
    { href: '/', label: 'Home' },
    { href: '/contests', label: 'Contests' },
    { href: '/about', label: 'About' },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-(--bg-page) text-(--text-primary)">
            <header
                className="sticky top-0 z-40 border-b backdrop-blur-xl"
                style={{ background: 'var(--bg-header)', borderColor: 'var(--border)' }}
            >
                <div className="mx-auto flex max-w-[1300px] items-center gap-6 px-4 py-3 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <ContestaLogo className="h-7 w-7 shrink-0" />
                        <span className="font-mono font-bold tracking-tight text-(--text-primary)">
                            Contest<span className="text-(--accent)">Forge</span>
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-1 md:flex">
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                                    style={{
                                        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                                        background: active ? 'var(--bg-card)' : 'transparent',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle />

                        <button
                            type="button"
                            aria-label="Toggle menu"
                            onClick={() => setMobileOpen((v) => !v)}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden"
                            style={{ color: 'var(--text-muted)' }}
                        >
                            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <nav
                        className="flex flex-col gap-1 border-t px-4 py-3 md:hidden"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        {NAV_ITEMS.map((item) => {
                            const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                                        background: active ? 'var(--bg-card)' : 'transparent',
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </header>

            {children}
        </div>
    );
}
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
                <div className="mx-auto flex h-16 max-w-[1300px] items-center px-6">
                    <Link href="/" className="flex items-center gap-3">
                        <ContestaLogo className="h-10 w-10 shrink-0" />

                        <span className="text-[1.7rem] font-extrabold tracking-tight text-(--text-primary)">
                            Contest
                            <span className="text-(--accent)">X</span>
                        </span>
                    </Link>

                    <nav className="ml-12 hidden items-center gap-2 md:flex">
                        {NAV_ITEMS.map((item) => {
                            const active =
                                pathname === item.href ||
                                (item.href !== "/" && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        color: active ? "var(--text-primary)" : "var(--text-muted)",
                                        background: active ? "var(--bg-card)" : "transparent",
                                    }}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle />
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
import Link from "next/link";
import { Github, Layers3 } from "lucide-react";

const FOOTER_LINKS = [
    { href: "/contests", label: "Contests" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/about#credits", label: "Credits" },
    { href: "#", label: "Privacy" },
    { href: "#", label: "Terms" },
] as const;

export function SiteFooter() {
    return (
        <footer className="border-t" style={{ borderColor: "var(--border)" }}>
            <div className="mx-auto flex max-w-[1300px] flex-col gap-8 px-4 py-14 md:px-0">
                {/* Brand */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-sm space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-(--accent)/10">
                                <Layers3 className="h-4 w-4 text-(--accent)" />
                            </span>
                            <span className="text-sm font-semibold tracking-tight text-(--text-primary)">
                                ContestForge
                            </span>
                        </div>
                        <p className="text-sm leading-6 text-(--text-secondary)">
                            Track upcoming programming contests across Codeforces, LeetCode,
                            AtCoder, CodeChef and more — all in one clean feed.
                        </p>
                    </div>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub"
                        className="text-(--text-muted) transition-colors hover:text-(--accent)"
                    >
                        <Github className="h-4 w-4" />
                    </a>
                </div>

                {/* Flat link list */}
                <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-(--text-secondary) transition-colors hover:text-(--text-primary)"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="border-t" style={{ borderColor: "var(--border)" }}>
                <div className="mx-auto flex max-w-[1200px] flex-col-reverse items-center gap-3 px-4 py-5 text-xs text-(--text-muted) sm:flex-row sm:justify-between md:px-0">
                    <span>Built for competitive programmers.</span>
                    <span className="font-mono">v0.4.2 · 2026-07-15</span>
                </div>
            </div>
        </footer>
    );
}
'use client';

export function ContestaLogo({ className = 'w-9 h-9' }: { className?: string }) {
    return (
        <img
            src="/contesta-logo.png"
            alt="ContestForge Logo"
            className={`${className} object-contain shrink-0`}
        />
    );
}

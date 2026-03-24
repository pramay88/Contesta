'use client';

export function ContestaLogo({ className = 'w-9 h-9' }: { className?: string }) {
    return (
        <img
            src="/contesta-logo.png"
            alt="Contesta Logo"
            className={`${className} object-contain flex-shrink-0`}
        />
    );
}

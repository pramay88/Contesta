import React from 'react';

export function ContestaLogo({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Background Circle - Optional gradient background */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Calendar Grid */}
            <g stroke="white" strokeWidth="3" fill="none" strokeLinecap="round">
                {/* Outer frame */}
                <rect x="20" y="25" width="60" height="55" rx="4" />

                {/* Header bar */}
                <line x1="20" y1="35" x2="80" y2="35" />

                {/* Vertical lines */}
                <line x1="35" y1="35" x2="35" y2="80" />
                <line x1="50" y1="35" x2="50" y2="80" />
                <line x1="65" y1="35" x2="65" y2="80" />

                {/* Horizontal lines */}
                <line x1="20" y1="50" x2="80" y2="50" />
                <line x1="20" y1="65" x2="80" y2="65" />
            </g>

            {/* Dynamic Checkmark/Lightning - Cyan accent */}
            <path
                d="M 35 45 L 45 58 L 70 30"
                stroke="#00D9FF"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Small accent dots for modern touch */}
            <circle cx="27.5" cy="30" r="2" fill="white" />
            <circle cx="72.5" cy="30" r="2" fill="white" />
        </svg>
    );
}

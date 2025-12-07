import React from 'react';
export function AtCoderIcon({ className = "" }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" fill="none" className={className}>
            <circle cx="16" cy="16" r="16" fill="#222" />
            <text x="16" y="21" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial, sans-serif">AC</text>
        </svg>
    );
} 
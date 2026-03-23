'use client';

// New Contesta logo based on provided SVG design
export function ContestaLogo({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Red bar */}
            <rect x="10" y="15" width="52" height="18" rx="9" fill="#EA4335" />
            {/* Yellow/orange bar */}
            <rect x="10" y="41" width="38" height="18" rx="9" fill="#FBBC04" />
            {/* Green bar */}
            <rect x="10" y="67" width="52" height="18" rx="9" fill="#34A853" />
            {/* Blue dot connector */}
            <circle cx="75" cy="59" r="10" fill="#4285F4" />
            <line x1="62" y1="50" x2="75" y2="50" stroke="#4285F4" strokeWidth="5" strokeLinecap="round" />
            <line x1="75" y1="50" x2="75" y2="59" stroke="#4285F4" strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}

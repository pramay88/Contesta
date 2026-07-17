import React from 'react';
import {
    SiLeetcode,
    SiCodechef,
    SiCodeforces,
    SiHackerrank,
    SiGeeksforgeeks,
    SiHackerearth,
    SiKaggle,
    SiTopcoder,
} from 'react-icons/si';
import { FaUserGraduate, FaCode } from 'react-icons/fa6';
import { getPlatformDefinition } from '@/lib/platforms';

function AtCoderIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 512 512" fill="none" aria-hidden="true">
            <rect width="512" height="512" fill="white" />
            <path
                d="M380.5 256c0-68.8-55.7-124.5-124.5-124.5S131.5 187.2 131.5 256 187.2 380.5 256 380.5 380.5 324.8 380.5 256z"
                fill="#000"
            />
            <path
                d="M256 100c86 0 156 70 156 156s-70 156-156 156-156-70-156-156S170 100 256 100m0-30c-102.6 0-186 83.4-186 186s83.4 186 186 186 186-83.4 186-186S358.6 70 256 70z"
                fill="#3c3c3c"
            />
            <text
                x="256"
                y="280"
                fontFamily="Arial, sans-serif"
                fontSize="120"
                fontWeight="bold"
                fill="white"
                textAnchor="middle"
            >
                At
            </text>
        </svg>
    );
}

interface PlatformIconProps {
    resource: string;
    className?: string;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'leetcode.com': SiLeetcode,
    'codeforces.com': SiCodeforces,
    'codechef.com': SiCodechef,
    'geeksforgeeks.org': SiGeeksforgeeks,
    'hackerrank.com': SiHackerrank,
    'hackerearth.com': SiHackerearth,
    'interviewbit.com': FaUserGraduate,
    'codingninjas.com': FaCode,
    'kaggle.com': SiKaggle,
    'topcoder.com': SiTopcoder,
    'atcoder.jp': AtCoderIcon,
    'naukri.com/code360': FaCode,
    devpost: FaCode,
    'devpost.com': FaCode,
    unstop: FaUserGraduate,
    'unstop.com': FaUserGraduate,
    kaggle: SiKaggle,
};

export function PlatformIcon({ resource, className = 'w-5 h-5' }: PlatformIconProps) {
    const normalized = resource?.toLowerCase().trim();

    if (!normalized || !getPlatformDefinition(normalized)) {
        return null;
    }

    const Icon = PLATFORM_ICONS[normalized] ?? FaCode;
    return <Icon className={className} />;
}
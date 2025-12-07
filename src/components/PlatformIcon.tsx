import React from 'react';
import {
    SiLeetcode,
    SiCodechef,
    SiCodeforces,
    SiHackerrank,
    SiGeeksforgeeks,
    SiHackerearth,
} from 'react-icons/si';
import { FaUserGraduate } from 'react-icons/fa6';

// Simple inline AtCoder icon instead of separate file
function AtCoderIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 512 512" fill="none">
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

export function PlatformIcon({ resource, className = 'w-5 h-5' }: PlatformIconProps) {
    const r = resource?.toLowerCase();

    if (r === 'leetcode.com')
        return <SiLeetcode className={`${className} text-yellow-500`} />;
    if (r === 'codeforces.com')
        return <SiCodeforces className={`${className} text-blue-500`} />;
    if (r === 'codechef.com')
        return <SiCodechef className={`${className} text-purple-700`} />;
    if (r === 'geeksforgeeks.org')
        return <SiGeeksforgeeks className={`${className} text-green-600`} />;
    if (r === 'hackerrank.com')
        return <SiHackerrank className={`${className} text-green-700`} />;
    if (r === 'hackerearth.com')
        return <SiHackerearth className={`${className} text-blue-900`} />;
    if (r === 'interviewbit.com')
        return <FaUserGraduate className={`${className} text-indigo-600`} />;
    if (r === 'codingninjas.com')
        return <img src="/codestudio.svg" alt="CodeStudio" className={className} />;
    if (r === 'atcoder.jp') return <AtCoderIcon className={className} />;

    return null;
}
export const SUPPORTED_RESOURCES = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'geeksforgeeks.org',
    'atcoder.jp',
    'naukri.com/code360',
];

export const PLATFORM_OPTIONS = [
    { value: 'leetcode.com', label: 'LeetCode' },
    { value: 'codeforces.com', label: 'Codeforces' },
    { value: 'codechef.com', label: 'CodeChef' },
    { value: 'geeksforgeeks.org', label: 'GFG' },
    { value: 'atcoder.jp', label: 'AtCoder' },
    { value: 'naukri.com/code360', label: 'Code360' },
];

export interface Contest {
    event: string;
    start: string;
    end: string;
    resource: string;
    href: string;
    status?: string;
}
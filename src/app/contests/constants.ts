export const SUPPORTED_RESOURCES = [
    'leetcode.com',
    'codeforces.com',
    'codechef.com',
    'geeksforgeeks.org',
    'atcoder.jp',
    'kaggle.com',
    'topcoder.com',
    'hackerrank.com',
    'hackerearth.com',
    'interviewbit.com',
    'codingninjas.com',
];

export const PLATFORM_OPTIONS = [
    { value: 'leetcode.com', label: 'LeetCode' },
    { value: 'codeforces.com', label: 'Codeforces' },
    { value: 'codechef.com', label: 'CodeChef' },
    { value: 'geeksforgeeks.org', label: 'GFG' },
    { value: 'atcoder.jp', label: 'AtCoder' },
    { value: 'kaggle.com', label: 'Kaggle' },
    { value: 'topcoder.com', label: 'TopCoder' },
    { value: 'hackerrank.com', label: 'HackerRank' },
    { value: 'hackerearth.com', label: 'HackerEarth' },
    { value: 'interviewbit.com', label: 'InterviewBit' },
    { value: 'codingninjas.com', label: 'CodeStudio' },
];

export interface Contest {
    event: string;
    start: string;
    end: string;
    resource: string;
    href: string;
    status?: string;
}
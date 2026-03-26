import { NextRequest, NextResponse } from 'next/server';

interface Hackathon {
    id: string;
    title: string;
    url: string;
    platform: 'devpost' | 'unstop' | 'kaggle';
    eventStart: string;
    eventEnd: string;
    status: 'upcoming' | 'live' | 'closed' | 'judging';
    type: 'online' | 'in-person' | 'hybrid';
    isPaid: boolean;
    organizer: string;
    domains: string[];
    skills: string[];
    totalPrize?: number;
    participants?: number;
    thumbnail?: string;
}

// Fetch from Unstop (local JSON) - disabled since file not in repo
async function fetchUnstopHackathons(): Promise<Hackathon[]> {
    // File not available in deployment
    return [];
}

// Sample data for Devpost and Kaggle (until scrapers are running)
function getSampleHackathons(): Hackathon[] {
    return [
        {
            id: 'devpost-1',
            title: 'AI Innovation Challenge 2025',
            url: 'https://devpost.com/hackathons',
            platform: 'devpost',
            eventStart: new Date('2025-01-15').toISOString(),
            eventEnd: new Date('2025-01-17').toISOString(),
            status: 'upcoming',
            type: 'online',
            isPaid: false,
            organizer: 'Tech Corp',
            domains: ['AI/ML', 'Web Development'],
            skills: ['Python', 'TensorFlow'],
            totalPrize: 10000,
            participants: 250,
        },
        {
            id: 'kaggle-1',
            title: 'Data Science Competition',
            url: 'https://www.kaggle.com/competitions',
            platform: 'kaggle',
            eventStart: new Date('2025-01-10').toISOString(),
            eventEnd: new Date('2025-03-10').toISOString(),
            status: 'live',
            type: 'online',
            isPaid: false,
            organizer: 'Kaggle',
            domains: ['Data Science', 'Machine Learning'],
            skills: ['Python', 'Pandas'],
            totalPrize: 25000,
            participants: 1500,
        },
    ];
}

export async function GET(request: NextRequest) {
    try {
        console.log('Fetching hackathons from all platforms...');

        // Fetch from all sources
        const [unstopHackathons] = await Promise.all([
            fetchUnstopHackathons(),
        ]);

        // Add sample data
        const sampleHackathons = getSampleHackathons();

        // Merge all hackathons
        const allHackathons = [...unstopHackathons, ...sampleHackathons];

        console.log(`Total hackathons: ${allHackathons.length}`);

        return NextResponse.json(
            { hackathons: allHackathons, total: allHackathons.length },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hackathons', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

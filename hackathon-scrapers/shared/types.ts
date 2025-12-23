// Shared types for all hackathon scrapers

export interface Hackathon {
    // Basic Info
    id: string;
    title: string;
    url: string;
    platform: 'devpost' | 'unstop' | 'kaggle';

    // Dates
    registrationStart?: Date;
    registrationEnd?: Date;
    eventStart: Date;
    eventEnd: Date;

    // Status
    status: 'upcoming' | 'live' | 'closed' | 'judging';

    // Type & Format
    type: 'online' | 'in-person' | 'hybrid';
    isPaid: boolean;
    entryFee?: number;
    currency?: string;

    // Location
    location?: {
        city?: string;
        state?: string;
        country?: string;
        venue?: string;
    };

    // Details
    description?: string;
    shortDescription?: string;
    organizer: string;

    // Categories
    domains: string[];        // AI/ML, Web Dev, etc.
    skills: string[];         // Python, React, etc.
    themes?: string[];        // Sustainability, Healthcare

    // Participation
    teamSize?: {
        min: number;
        max: number;
    };
    eligibility?: string[];   // Students, Professionals

    // Prizes
    totalPrize?: number;
    prizes?: Prize[];

    // Stats
    participants?: number;
    submissions?: number;

    // Media
    thumbnail?: string;
    images?: string[];

    // Metadata
    scrapedAt: Date;
    lastUpdated: Date;
}

export interface Prize {
    rank: string;
    amount: number;
    description?: string;
}

export interface ScraperConfig {
    headless?: boolean;
    timeout?: number;
    maxRetries?: number;
    userAgent?: string;
}

export interface APIQuery {
    platform?: 'devpost' | 'unstop' | 'kaggle' | 'all';
    status?: 'upcoming' | 'live' | 'closed' | 'judging';
    type?: 'online' | 'in-person' | 'hybrid';
    isPaid?: boolean;
    domain?: string;
    startAfter?: string;
    startBefore?: string;
    endAfter?: string;
    endBefore?: string;
    minPrize?: number;
    country?: string;
    limit?: number;
    offset?: number;
}

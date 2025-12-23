import axios from 'axios';
import * as cheerio from 'cheerio';
import type { Hackathon } from '../../shared/types.js';

export class KaggleScraper {
    private baseUrl = 'https://www.kaggle.com';

    async scrapeAll(): Promise<Hackathon[]> {
        console.log('Fetching Kaggle competitions...');

        try {
            // Try official API first
            const competitions = await this.fetchFromAPI();
            if (competitions.length > 0) {
                return competitions;
            }
        } catch (error) {
            console.log('API failed, falling back to web scraping...');
        }

        // Fallback to web scraping
        return await this.scrapeWeb();
    }

    private async fetchFromAPI(): Promise<Hackathon[]> {
        // Kaggle's public competitions endpoint
        const url = `${this.baseUrl}/api/v1/competitions/list`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const competitions = response.data;
        console.log(`Found ${competitions.length} competitions from API`);

        return competitions.map((comp: any) => this.normalizeCompetition(comp));
    }

    private async scrapeWeb(): Promise<Hackathon[]> {
        const url = `${this.baseUrl}/competitions`;

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const $ = cheerio.load(response.data);
        const competitions: any[] = [];

        $('.competition-list-item, [class*="competition"]').each((_, element) => {
            try {
                const $el = $(element);

                const title = $el.find('h3, .competition-title').text().trim();
                const url = $el.find('a').attr('href') || '';
                const deadline = $el.find('.competition-deadline, [class*="deadline"]').text().trim();
                const prize = $el.find('.competition-prize, [class*="prize"]').text().trim();
                const participants = $el.find('.competition-participants, [class*="participants"]').text().trim();

                if (title && url) {
                    competitions.push({
                        title,
                        url: url.startsWith('http') ? url : `${this.baseUrl}${url}`,
                        deadline,
                        prize,
                        participants
                    });
                }
            } catch (err) {
                console.error('Error parsing competition:', err);
            }
        });

        console.log(`Found ${competitions.length} competitions from web scraping`);

        return competitions.map(comp => this.normalizeCompetition(comp));
    }

    private normalizeCompetition(raw: any): Hackathon {
        const now = new Date();

        // Parse dates
        const deadline = raw.deadline || raw.deadlineDate;
        const eventEnd = deadline ? new Date(deadline) : new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        const eventStart = raw.enabledDate ? new Date(raw.enabledDate) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Determine status
        let status: 'upcoming' | 'live' | 'closed' | 'judging' = 'live';
        if (eventEnd < now) status = 'closed';
        if (eventStart > now) status = 'upcoming';

        // Parse prize
        const prizeText = raw.prize || raw.reward || '';
        const prizeMatch = prizeText.match(/\$?([\d,]+)/);
        const totalPrize = prizeMatch ? parseInt(prizeMatch[1].replace(/,/g, '')) : undefined;

        // Parse participants
        const participants = raw.numTeams || raw.participants || undefined;

        return {
            id: raw.id || raw.url?.split('/').pop() || Math.random().toString(36).substr(2, 9),
            title: raw.title || raw.name || '',
            url: raw.url || `${this.baseUrl}/c/${raw.id}`,
            platform: 'kaggle',

            eventStart,
            eventEnd,

            status,
            type: 'online', // Kaggle is always online
            isPaid: false,

            organizer: raw.organizationName || 'Kaggle',

            domains: raw.tags || ['Data Science', 'Machine Learning'],
            skills: ['Python', 'Data Analysis'],

            totalPrize,

            participants,
            submissions: raw.numSubmissions,

            thumbnail: raw.thumbnailImageUrl,

            scrapedAt: now,
            lastUpdated: now
        };
    }
}

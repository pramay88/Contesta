import puppeteer, { Browser, Page } from 'puppeteer';
import type { Hackathon } from '../../shared/types.js';

export class DevpostScraper {
    private browser: Browser | null = null;

    async init() {
        this.browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async scrapeAll(): Promise<Hackathon[]> {
        if (!this.browser) await this.init();

        const page = await this.browser!.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

        console.log('Navigating to Devpost hackathons...');
        await page.goto('https://devpost.com/hackathons', { waitUntil: 'networkidle2' });

        // Scroll to load more hackathons
        await this.autoScroll(page);

        console.log('Extracting hackathon data...');
        const hackathons = await page.evaluate(() => {
            const cards = document.querySelectorAll('.challenge-listing');
            const results: any[] = [];

            cards.forEach((card) => {
                try {
                    const titleEl = card.querySelector('.challenge-title a');
                    const title = titleEl?.textContent?.trim() || '';
                    const url = titleEl?.getAttribute('href') || '';

                    const statusEl = card.querySelector('.challenge-status');
                    const statusText = statusEl?.textContent?.trim().toLowerCase() || '';

                    const dateEl = card.querySelector('.challenge-date');
                    const dateText = dateEl?.textContent?.trim() || '';

                    const locationEl = card.querySelector('.challenge-location');
                    const locationText = locationEl?.textContent?.trim() || '';

                    const prizeEl = card.querySelector('.challenge-prize');
                    const prizeText = prizeEl?.textContent?.trim() || '';

                    const participantsEl = card.querySelector('.challenge-participants');
                    const participantsText = participantsEl?.textContent?.trim() || '';

                    const thumbnailEl = card.querySelector('img');
                    const thumbnail = thumbnailEl?.getAttribute('src') || '';

                    const themesEl = card.querySelectorAll('.challenge-theme');
                    const themes: string[] = [];
                    themesEl.forEach(t => themes.push(t.textContent?.trim() || ''));

                    if (title && url) {
                        results.push({
                            title,
                            url: url.startsWith('http') ? url : `https://devpost.com${url}`,
                            statusText,
                            dateText,
                            locationText,
                            prizeText,
                            participantsText,
                            thumbnail,
                            themes
                        });
                    }
                } catch (err) {
                    console.error('Error parsing card:', err);
                }
            });

            return results;
        });

        console.log(`Found ${hackathons.length} hackathons`);

        // Parse and normalize data
        const normalized = hackathons.map(h => this.normalizeHackathon(h));

        await page.close();
        return normalized;
    }

    private normalizeHackathon(raw: any): Hackathon {
        const now = new Date();

        // Parse status
        let status: 'upcoming' | 'live' | 'closed' | 'judging' = 'upcoming';
        if (raw.statusText.includes('submission')) status = 'live';
        if (raw.statusText.includes('closed') || raw.statusText.includes('ended')) status = 'closed';
        if (raw.statusText.includes('judging')) status = 'judging';

        // Parse type
        let type: 'online' | 'in-person' | 'hybrid' = 'online';
        if (raw.locationText && !raw.locationText.toLowerCase().includes('online')) {
            type = raw.locationText.toLowerCase().includes('hybrid') ? 'hybrid' : 'in-person';
        }

        // Parse dates from dateText (e.g., "Dec 15 - Dec 20")
        const dates = this.parseDates(raw.dateText);

        // Parse prize
        const prizeInfo = this.parsePrize(raw.prizeText);

        // Parse participants
        const participants = this.parseNumber(raw.participantsText);

        // Parse location
        const location = this.parseLocation(raw.locationText);

        return {
            id: this.generateId(raw.url),
            title: raw.title,
            url: raw.url,
            platform: 'devpost',

            eventStart: dates.start || now,
            eventEnd: dates.end || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),

            status,
            type,
            isPaid: false, // Devpost hackathons are typically free

            location,
            organizer: 'Unknown', // Would need to scrape detail page

            domains: raw.themes || [],
            skills: [],
            themes: raw.themes || [],

            totalPrize: prizeInfo.total,

            participants,

            thumbnail: raw.thumbnail,

            scrapedAt: now,
            lastUpdated: now
        };
    }

    private parseDates(dateText: string): { start: Date | null; end: Date | null } {
        // Example: "Dec 15 - Dec 20, 2025"
        try {
            const parts = dateText.split('-');
            if (parts.length === 2) {
                const startStr = parts[0].trim();
                const endStr = parts[1].trim();

                // Simple date parsing (would need more robust solution)
                const start = new Date(startStr);
                const end = new Date(endStr);

                return { start, end };
            }
        } catch (err) {
            console.error('Error parsing dates:', err);
        }

        return { start: null, end: null };
    }

    private parsePrize(prizeText: string): { total: number | undefined } {
        // Example: "$10,000 in prizes"
        const match = prizeText.match(/\$?([\d,]+)/);
        if (match) {
            const amount = parseInt(match[1].replace(/,/g, ''));
            return { total: amount };
        }
        return { total: undefined };
    }

    private parseNumber(text: string): number | undefined {
        const match = text.match(/([\d,]+)/);
        if (match) {
            return parseInt(match[1].replace(/,/g, ''));
        }
        return undefined;
    }

    private parseLocation(locationText: string): any {
        if (!locationText || locationText.toLowerCase().includes('online')) {
            return undefined;
        }

        // Simple parsing - would need more sophisticated logic
        return {
            city: locationText,
            country: undefined
        };
    }

    private generateId(url: string): string {
        return url.split('/').pop() || Math.random().toString(36).substr(2, 9);
    }

    private async autoScroll(page: Page) {
        await page.evaluate(async () => {
            await new Promise<void>((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight - window.innerHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Wait for content to load
        await page.waitForTimeout(2000);
    }
}

import puppeteer, { Browser, Page } from 'puppeteer';
import type { Hackathon } from '../../shared/types.js';

export class UnstopScraper {
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

        console.log('Navigating to Unstop hackathons...');
        await page.goto('https://unstop.com/hackathons', {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        // Wait for content to load
        await page.waitForTimeout(3000);

        // Scroll to load more
        await this.autoScroll(page);

        console.log('Extracting hackathon data...');
        const hackathons = await page.evaluate(() => {
            const results: any[] = [];

            // Try multiple selectors
            const selectors = [
                'div[class*="card"]',
                'div[class*="opportunity"]',
                'div[class*="challenge"]',
                'article'
            ];

            let cards: NodeListOf<Element> | null = null;
            for (const selector of selectors) {
                cards = document.querySelectorAll(selector);
                if (cards.length > 0) break;
            }

            if (!cards || cards.length === 0) return results;

            cards.forEach((card) => {
                try {
                    // Extract title
                    const titleEl = card.querySelector('h1, h2, h3, h4, [class*="title"]');
                    const title = titleEl?.textContent?.trim() || '';

                    // Extract URL
                    const linkEl = card.querySelector('a');
                    const url = linkEl?.getAttribute('href') || '';

                    // Extract dates
                    const dateEl = card.querySelector('[class*="date"], [class*="deadline"], time');
                    const dateText = dateEl?.textContent?.trim() || '';

                    // Extract location
                    const locationEl = card.querySelector('[class*="location"], [class*="venue"]');
                    const locationText = locationEl?.textContent?.trim() || '';

                    // Extract type (online/offline)
                    const typeEl = card.querySelector('[class*="type"], [class*="mode"]');
                    const typeText = typeEl?.textContent?.trim().toLowerCase() || '';

                    // Extract registration count
                    const regEl = card.querySelector('[class*="registered"], [class*="participants"]');
                    const registeredText = regEl?.textContent?.trim() || '';

                    // Extract prize
                    const prizeEl = card.querySelector('[class*="prize"], [class*="reward"]');
                    const prizeText = prizeEl?.textContent?.trim() || '';

                    // Extract domains/skills
                    const tagEls = card.querySelectorAll('[class*="tag"], [class*="skill"], [class*="domain"]');
                    const tags: string[] = [];
                    tagEls.forEach(t => {
                        const text = t.textContent?.trim();
                        if (text) tags.push(text);
                    });

                    // Extract thumbnail
                    const imgEl = card.querySelector('img');
                    const thumbnail = imgEl?.getAttribute('src') || '';

                    if (title && url) {
                        results.push({
                            title,
                            url: url.startsWith('http') ? url : `https://unstop.com${url}`,
                            dateText,
                            locationText,
                            typeText,
                            registeredText,
                            prizeText,
                            tags,
                            thumbnail
                        });
                    }
                } catch (err) {
                    console.error('Error parsing card:', err);
                }
            });

            return results;
        });

        console.log(`Found ${hackathons.length} hackathons`);

        const normalized = hackathons.map(h => this.normalizeHackathon(h));

        await page.close();
        return normalized;
    }

    private normalizeHackathon(raw: any): Hackathon {
        const now = new Date();

        // Parse status from date text
        let status: 'upcoming' | 'live' | 'closed' | 'judging' = 'upcoming';
        const dateText = raw.dateText.toLowerCase();
        if (dateText.includes('live') || dateText.includes('ongoing')) status = 'live';
        if (dateText.includes('closed') || dateText.includes('ended')) status = 'closed';
        if (dateText.includes('days left') || dateText.includes('hours left')) status = 'live';

        // Parse type
        let type: 'online' | 'in-person' | 'hybrid' = 'online';
        const typeText = raw.typeText || raw.locationText.toLowerCase();
        if (typeText.includes('offline') || typeText.includes('in-person')) type = 'in-person';
        if (typeText.includes('hybrid')) type = 'hybrid';

        // Check if paid
        const isPaid = raw.prizeText.toLowerCase().includes('₹') ||
            raw.prizeText.toLowerCase().includes('fee') ||
            raw.prizeText.toLowerCase().includes('paid');

        // Parse participants
        const participantsMatch = raw.registeredText.match(/([\d,]+)/);
        const participants = participantsMatch ? parseInt(participantsMatch[1].replace(/,/g, '')) : undefined;

        // Parse prize
        const prizeMatch = raw.prizeText.match(/₹?([\d,]+)/);
        const totalPrize = prizeMatch ? parseInt(prizeMatch[1].replace(/,/g, '')) : undefined;

        // Parse location
        const location = raw.locationText && !raw.locationText.toLowerCase().includes('online')
            ? { city: raw.locationText }
            : undefined;

        return {
            id: this.generateId(raw.url),
            title: raw.title,
            url: raw.url,
            platform: 'unstop',

            eventStart: now, // Would need better date parsing
            eventEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),

            status,
            type,
            isPaid,
            currency: isPaid ? 'INR' : undefined,

            location,
            organizer: 'Unknown',

            domains: raw.tags.filter((t: string) => !t.match(/\d/)), // Filter out numbers
            skills: [],

            totalPrize,
            participants,

            thumbnail: raw.thumbnail,

            scrapedAt: now,
            lastUpdated: now
        };
    }

    private generateId(url: string): string {
        return url.split('/').pop()?.split('?')[0] || Math.random().toString(36).substr(2, 9);
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

        await page.waitForTimeout(2000);
    }
}

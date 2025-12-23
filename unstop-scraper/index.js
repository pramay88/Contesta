import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const UNSTOP_URL = 'https://unstop.com/hackathons';

async function scrapeUnstopHackathons() {
    try {
        console.log('Fetching Unstop hackathons...');

        const response = await fetch(UNSTOP_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const contests = [];

        // Unstop uses card-based layout for hackathons
        $('.opportunity-card, .challenge-card, [class*="card"]').each((index, element) => {
            try {
                const $card = $(element);

                // Extract title
                const title = $card.find('h3, h2, .title, [class*="title"]').first().text().trim() ||
                    $card.find('a').first().text().trim();

                // Extract URL
                const relativeUrl = $card.find('a').first().attr('href');
                const url = relativeUrl ?
                    (relativeUrl.startsWith('http') ? relativeUrl : `https://unstop.com${relativeUrl}`) :
                    '';

                // Extract dates - Unstop typically shows registration deadline
                const dateText = $card.find('[class*="date"], [class*="deadline"], time').text().trim();

                // Extract registration deadline
                let registrationEnd = null;
                if (dateText) {
                    // Try to parse date from text
                    const dateMatch = dateText.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
                    if (dateMatch) {
                        const [, day, month, year] = dateMatch;
                        registrationEnd = new Date(`${month} ${day}, ${year}`).toISOString();
                    }
                }

                // Only add if we have at least a title and URL
                if (title && url && title.length > 3) {
                    contests.push({
                        event: title,
                        start: registrationEnd || new Date().toISOString(), // Use current date if no date found
                        end: registrationEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
                        resource: 'unstop.com',
                        href: url,
                        status: 'upcoming'
                    });
                }
            } catch (err) {
                console.error('Error parsing card:', err.message);
            }
        });

        // Remove duplicates based on URL
        const uniqueContests = contests.filter((contest, index, self) =>
            index === self.findIndex((c) => c.href === contest.href)
        );

        console.log(`Found ${uniqueContests.length} unique hackathons`);

        // Save to JSON file
        const output = {
            contests: uniqueContests,
            lastUpdated: new Date().toISOString(),
            source: UNSTOP_URL
        };

        writeFileSync('unstop-contests.json', JSON.stringify(output, null, 2));
        console.log('Saved to unstop-contests.json');

        return uniqueContests;
    } catch (error) {
        console.error('Error scraping Unstop:', error);
        return [];
    }
}

// Run scraper
scrapeUnstopHackathons()
    .then(contests => {
        console.log('\\nScraping complete!');
        console.log(`Total contests: ${contests.length}`);
        if (contests.length > 0) {
            console.log('\\nFirst contest:', contests[0]);
        }
    })
    .catch(err => console.error('Fatal error:', err));

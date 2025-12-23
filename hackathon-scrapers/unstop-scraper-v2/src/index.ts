import { UnstopScraper } from './scraper.js';

async function main() {
    const scraper = new UnstopScraper();

    try {
        console.log('Starting Unstop scraper v2...');
        const hackathons = await scraper.scrapeAll();

        console.log(`\n✅ Scraped ${hackathons.length} hackathons\n`);

        if (hackathons.length > 0) {
            console.log('Sample hackathon:');
            console.log(JSON.stringify(hackathons[0], null, 2));
        }

        const fs = await import('fs');
        fs.writeFileSync(
            'unstop-hackathons.json',
            JSON.stringify({ hackathons, lastUpdated: new Date() }, null, 2)
        );

        console.log('\n💾 Saved to unstop-hackathons.json');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await scraper.close();
    }
}

main();

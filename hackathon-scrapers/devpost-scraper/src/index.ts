import { DevpostScraper } from './scraper.js';

async function main() {
    const scraper = new DevpostScraper();

    try {
        console.log('Starting Devpost scraper...');
        const hackathons = await scraper.scrapeAll();

        console.log(`\n✅ Scraped ${hackathons.length} hackathons\n`);

        // Show sample
        if (hackathons.length > 0) {
            console.log('Sample hackathon:');
            console.log(JSON.stringify(hackathons[0], null, 2));
        }

        // Save to file
        const fs = await import('fs');
        fs.writeFileSync(
            'devpost-hackathons.json',
            JSON.stringify({ hackathons, lastUpdated: new Date() }, null, 2)
        );

        console.log('\n💾 Saved to devpost-hackathons.json');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await scraper.close();
    }
}

main();

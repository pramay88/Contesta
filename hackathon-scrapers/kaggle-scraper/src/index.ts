import { KaggleScraper } from './scraper.js';

async function main() {
    const scraper = new KaggleScraper();

    try {
        console.log('Starting Kaggle scraper...');
        const competitions = await scraper.scrapeAll();

        console.log(`\n✅ Scraped ${competitions.length} competitions\n`);

        if (competitions.length > 0) {
            console.log('Sample competition:');
            console.log(JSON.stringify(competitions[0], null, 2));
        }

        const fs = await import('fs');
        fs.writeFileSync(
            'kaggle-competitions.json',
            JSON.stringify({ competitions, lastUpdated: new Date() }, null, 2)
        );

        console.log('\n💾 Saved to kaggle-competitions.json');

    } catch (error) {
        console.error('Error:', error);
    }
}

main();

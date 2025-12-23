import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import { UnstopScraper } from './scraper.js';
import type { Hackathon } from '../../shared/types.js';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });
const scraper = new UnstopScraper();

app.use(cors());
app.use(express.json());

app.get('/api/hackathons', async (req, res) => {
    try {
        const cached = cache.get<Hackathon[]>('all');

        if (cached) {
            return res.json({ hackathons: cached, cached: true });
        }

        const hackathons = await scraper.scrapeAll();
        cache.set('all', hackathons);

        res.json({ hackathons, total: hackathons.length, cached: false });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
});

app.post('/api/refresh', async (req, res) => {
    try {
        cache.flushAll();
        const hackathons = await scraper.scrapeAll();
        res.json({ message: 'Cache refreshed', count: hackathons.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh' });
    }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`🚀 Unstop API running on http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await scraper.close();
    process.exit(0);
});

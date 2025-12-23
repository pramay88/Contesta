import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import { KaggleScraper } from './scraper.js';
import type { Hackathon } from '../../shared/types.js';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });
const scraper = new KaggleScraper();

app.use(cors());
app.use(express.json());

app.get('/api/competitions', async (req, res) => {
    try {
        const cached = cache.get<Hackathon[]>('all');

        if (cached) {
            return res.json({ competitions: cached, cached: true });
        }

        const competitions = await scraper.scrapeAll();
        cache.set('all', competitions);

        res.json({ competitions, total: competitions.length, cached: false });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch competitions' });
    }
});

app.post('/api/refresh', async (req, res) => {
    try {
        cache.flushAll();
        const competitions = await scraper.scrapeAll();
        res.json({ message: 'Cache refreshed', count: competitions.length });
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh' });
    }
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`🚀 Kaggle API running on http://localhost:${PORT}`);
});

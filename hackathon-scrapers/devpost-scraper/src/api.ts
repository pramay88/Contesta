import express from 'express';
import cors from 'cors';
import NodeCache from 'node-cache';
import { DevpostScraper } from './scraper.js';
import type { Hackathon, APIQuery } from '../../shared/types.js';

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache
const scraper = new DevpostScraper();

app.use(cors());
app.use(express.json());

// Get all hackathons with filtering
app.get('/api/hackathons', async (req, res) => {
    try {
        const query: APIQuery = req.query;

        // Check cache
        const cacheKey = JSON.stringify(query);
        const cached = cache.get<Hackathon[]>(cacheKey);

        if (cached) {
            console.log('Returning cached data');
            return res.json({ hackathons: cached, cached: true });
        }

        // Scrape fresh data
        console.log('Scraping fresh data...');
        let hackathons = await scraper.scrapeAll();

        // Apply filters
        hackathons = filterHackathons(hackathons, query);

        // Apply pagination
        const limit = parseInt(query.limit as string) || 50;
        const offset = parseInt(query.offset as string) || 0;
        const paginated = hackathons.slice(offset, offset + limit);

        // Cache results
        cache.set(cacheKey, paginated);

        res.json({
            hackathons: paginated,
            total: hackathons.length,
            limit,
            offset,
            cached: false
        });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch hackathons' });
    }
});

// Get single hackathon by ID
app.get('/api/hackathons/:id', async (req, res) => {
    try {
        const hackathons = await scraper.scrapeAll();
        const hackathon = hackathons.find(h => h.id === req.params.id);

        if (!hackathon) {
            return res.status(404).json({ error: 'Hackathon not found' });
        }

        res.json({ hackathon });
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch hackathon' });
    }
});

// Refresh cache
app.post('/api/refresh', async (req, res) => {
    try {
        cache.flushAll();
        const hackathons = await scraper.scrapeAll();
        res.json({ message: 'Cache refreshed', count: hackathons.length });
    } catch (error) {
        console.error('Refresh error:', error);
        res.status(500).json({ error: 'Failed to refresh' });
    }
});

// Get stats
app.get('/api/stats', async (req, res) => {
    try {
        const hackathons = await scraper.scrapeAll();

        const stats = {
            total: hackathons.length,
            byStatus: countBy(hackathons, 'status'),
            byType: countBy(hackathons, 'type'),
            totalPrizes: hackathons.reduce((sum, h) => sum + (h.totalPrize || 0), 0),
            avgParticipants: hackathons.reduce((sum, h) => sum + (h.participants || 0), 0) / hackathons.length
        };

        res.json(stats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

function filterHackathons(hackathons: Hackathon[], query: APIQuery): Hackathon[] {
    return hackathons.filter(h => {
        if (query.status && h.status !== query.status) return false;
        if (query.type && h.type !== query.type) return false;
        if (query.isPaid !== undefined && h.isPaid !== query.isPaid) return false;
        if (query.domain && !h.domains.some(d => d.toLowerCase().includes(query.domain!.toLowerCase()))) return false;
        if (query.minPrize && (!h.totalPrize || h.totalPrize < query.minPrize)) return false;
        if (query.country && h.location?.country !== query.country) return false;

        if (query.startAfter && h.eventStart < new Date(query.startAfter)) return false;
        if (query.startBefore && h.eventStart > new Date(query.startBefore)) return false;
        if (query.endAfter && h.eventEnd < new Date(query.endAfter)) return false;
        if (query.endBefore && h.eventEnd > new Date(query.endBefore)) return false;

        return true;
    });
}

function countBy(arr: any[], key: string): Record<string, number> {
    return arr.reduce((acc, item) => {
        const value = item[key] || 'unknown';
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Devpost API running on http://localhost:${PORT}`);
    console.log(`📊 Endpoints:`);
    console.log(`   GET  /api/hackathons - Get all hackathons`);
    console.log(`   GET  /api/hackathons/:id - Get single hackathon`);
    console.log(`   POST /api/refresh - Refresh cache`);
    console.log(`   GET  /api/stats - Get statistics`);
});

// Cleanup on exit
process.on('SIGINT', async () => {
    await scraper.close();
    process.exit(0);
});

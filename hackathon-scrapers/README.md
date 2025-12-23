# Hackathon Scrapers

Automated scrapers for Devpost, Kaggle, and Unstop with rich metadata extraction.

## Features

✅ **Fully Automated** - No manual browser console needed
✅ **Rich Metadata** - Status, type, paid/free, locations, domains, skills, prizes, participants
✅ **Flexible APIs** - Filter by platform, status, type, dates, prizes, and more
✅ **Caching** - Fast responses with 1-hour cache
✅ **TypeScript** - Full type safety

---

## Quick Start

### 1. Devpost Scraper

```bash
cd hackathon-scrapers/devpost-scraper
npm install
npm run scrape  # Run scraper once
npm run api     # Start API server on port 3001
```

**API Endpoints:**
- `GET /api/hackathons` - Get all hackathons
- `GET /api/hackathons/:id` - Get single hackathon
- `POST /api/refresh` - Refresh cache
- `GET /api/stats` - Get statistics

**Example:**
```bash
curl "http://localhost:3001/api/hackathons?status=live&type=online&minPrize=5000"
```

### 2. Kaggle Scraper

```bash
cd hackathon-scrapers/kaggle-scraper
npm install
npm run scrape  # Run scraper once
```

Uses official Kaggle API with web scraping fallback.

### 3. Unstop Scraper v2

```bash
cd hackathon-scrapers/unstop-scraper-v2
npm install
npm run scrape  # Run scraper once
```

Fully automated with Puppeteer (no browser console needed!).

---

## Data Schema

Each hackathon includes:

```typescript
{
  id: string;
  title: string;
  url: string;
  platform: 'devpost' | 'unstop' | 'kaggle';
  
  // Dates
  eventStart: Date;
  eventEnd: Date;
  registrationStart?: Date;
  registrationEnd?: Date;
  
  // Status & Type
  status: 'upcoming' | 'live' | 'closed' | 'judging';
  type: 'online' | 'in-person' | 'hybrid';
  isPaid: boolean;
  entryFee?: number;
  currency?: string;
  
  // Location
  location?: {
    city?: string;
    country?: string;
    venue?: string;
  };
  
  // Categories
  domains: string[];  // AI/ML, Web Dev, etc.
  skills: string[];   // Python, React, etc.
  themes?: string[];
  
  // Details
  organizer: string;
  description?: string;
  
  // Participation
  teamSize?: { min: number; max: number };
  eligibility?: string[];
  
  // Prizes & Stats
  totalPrize?: number;
  prizes?: Prize[];
  participants?: number;
  submissions?: number;
  
  // Media
  thumbnail?: string;
  images?: string[];
}
```

---

## API Query Parameters

Filter hackathons with these parameters:

- `platform` - devpost | unstop | kaggle | all
- `status` - upcoming | live | closed | judging
- `type` - online | in-person | hybrid
- `isPaid` - true | false
- `domain` - AI/ML, Web Dev, etc.
- `startAfter` - ISO date
- `startBefore` - ISO date
- `endAfter` - ISO date
- `endBefore` - ISO date
- `minPrize` - number
- `country` - string
- `limit` - number (default: 50)
- `offset` - number (default: 0)

---

## Integration with Main App

To use in your contests app:

```typescript
// Fetch from all platforms
const response = await fetch('http://localhost:3001/api/hackathons');
const { hackathons } = await response.json();

// Filter by status
const liveHackathons = await fetch(
  'http://localhost:3001/api/hackathons?status=live&type=online'
);
```

---

## Project Structure

```
hackathon-scrapers/
├── shared/
│   └── types.ts           # Shared TypeScript types
├── devpost-scraper/
│   ├── src/
│   │   ├── scraper.ts     # Puppeteer scraper
│   │   ├── api.ts         # Express API server
│   │   └── index.ts       # CLI tool
│   └── package.json
├── kaggle-scraper/
│   ├── src/
│   │   ├── scraper.ts     # API + fallback scraper
│   │   └── index.ts
│   └── package.json
└── unstop-scraper-v2/
    ├── src/
    │   ├── scraper.ts     # Puppeteer scraper
    │   └── index.ts
    └── package.json
```

---

## Next Steps

1. **Install dependencies** for each scraper
2. **Test scrapers** individually
3. **Run API servers** (different ports)
4. **Integrate** with main contests app
5. **Deploy** to production

---

## Notes

- **Puppeteer** requires Chrome/Chromium
- **Rate limiting** - Be respectful of websites
- **Caching** - 1 hour default, configurable
- **Error handling** - Graceful fallbacks included

Happy scraping! 🚀

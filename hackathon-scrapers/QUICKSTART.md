# Quick Start Guide

## Installation

```bash
cd hackathon-scrapers
install-all.bat  # Windows
# or
./install-all.sh  # Linux/Mac
```

## Usage

### Start All APIs

```bash
# Terminal 1 - Devpost (port 3001)
cd devpost-scraper
npm run api

# Terminal 2 - Kaggle (port 3002)
cd kaggle-scraper
npm run api

# Terminal 3 - Unstop (port 3003)
cd unstop-scraper-v2
npm run api
```

### Test APIs

```bash
# Devpost
curl http://localhost:3001/api/hackathons

# Kaggle
curl http://localhost:3002/api/competitions

# Unstop
curl http://localhost:3003/api/hackathons
```

### Run Scrapers Standalone

```bash
# Devpost
cd devpost-scraper
npm run scrape  # Saves to devpost-hackathons.json

# Kaggle
cd kaggle-scraper
npm run scrape  # Saves to kaggle-competitions.json

# Unstop
cd unstop-scraper-v2
npm run scrape  # Saves to unstop-hackathons.json
```

## API Endpoints

### Devpost (port 3001)
- `GET /api/hackathons` - List all
- `GET /api/hackathons/:id` - Get one
- `POST /api/refresh` - Refresh cache
- `GET /api/stats` - Statistics

### Kaggle (port 3002)
- `GET /api/competitions` - List all
- `POST /api/refresh` - Refresh cache

### Unstop (port 3003)
- `GET /api/hackathons` - List all
- `POST /api/refresh` - Refresh cache

## Filtering (Devpost)

```bash
# Live hackathons only
curl "http://localhost:3001/api/hackathons?status=live"

# Online with min $5000 prize
curl "http://localhost:3001/api/hackathons?type=online&minPrize=5000"

# By domain
curl "http://localhost:3001/api/hackathons?domain=AI"
```

## Files Created

```
hackathon-scrapers/
├── README.md
├── install-all.bat
├── install-all.sh
├── shared/
│   └── types.ts
├── devpost-scraper/
│   ├── src/
│   │   ├── scraper.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── kaggle-scraper/
│   ├── src/
│   │   ├── scraper.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── unstop-scraper-v2/
    ├── src/
    │   ├── scraper.ts
    │   ├── api.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

Total: **18 files** created!

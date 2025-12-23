# Unstop Scraper

A simple scraper for Unstop (formerly Dare2Compete) hackathons and competitions.

## Why This Approach?

Unstop uses JavaScript rendering for their website, which means simple HTML scraping doesn't work. This project provides two methods:

1. **Browser-based scraping** (Recommended for updates)
2. **Manual JSON file** (For serving data to the main app)

## How to Update Unstop Contests

### Method 1: Browser Console (Recommended)

1. Visit https://unstop.com/hackathons in your browser
2. Open browser console (F12 → Console tab)
3. Copy and paste the contents of `browser-scraper.js`
4. Press Enter to run the script
5. Copy the JSON output from the console
6. Paste it into `unstop-contests.json`

### Method 2: Manual Entry

Edit `unstop-contests.json` directly and add contests in this format:

```json
{
  "contests": [
    {
      "event": "Contest Name",
      "start": "2025-12-15T00:00:00.000Z",
      "end": "2025-12-20T23:59:59.000Z",
      "resource": "unstop.com",
      "href": "https://unstop.com/hackathons/contest-slug"
    }
  ],
  "lastUpdated": "2025-12-11T18:10:00.000Z",
  "source": "https://unstop.com/hackathons"
}
```

## Integration with Main App

The main contests app reads from `unstop-contests.json` automatically via the API route at `/api/contests`.

## Files

- `index.js` - Node.js scraper (doesn't work due to JS rendering)
- `browser-scraper.js` - Browser console script (works!)
- `unstop-contests.json` - Data file read by main app
- `package.json` - Dependencies

## Notes

- Unstop doesn't have an official API
- The website requires JavaScript, so server-side scraping is difficult
- Browser-based scraping is the most reliable method
- Update the JSON file periodically to keep contests fresh
- The main app caches API responses for 5 minutes

## Future Improvements

- Automated browser scraping with Puppeteer/Playwright
- Scheduled updates via cron job
- Better date parsing from Unstop's format

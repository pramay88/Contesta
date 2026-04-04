It allows you to view upcoming programming contests from multiple platforms, add them to your calendar, and stay organized so you never miss a competition.


Supports LeetCode, Codeforces, CodeChef, AtCoder, GFG and more.


https://contests-io.vercel.app/contests

## Environment Variables

Required for contest data:
- `CLIST_API_USERNAME` - Your clist.by API username
- `CLIST_API_KEY` - Your clist.by API key

Required for caching (Upstash Redis):
- `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
- `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token

Optional:
- `CACHE_REFRESH_TOKEN` - Secret token for `/api/refresh` endpoint (recommended for production)

## API Endpoints

- `GET /api/contests?month=4&year=2026` - Get contests (cached with SWR)
- `GET /api/hackathons` - Get hackathons (cached with SWR)
- `POST /api/refresh?type=all&rebuild=true` - Manually invalidate and rebuild cache

## Caching

Uses Upstash Redis with stale-while-revalidate (SWR) strategy:
- Fresh data: 15 minutes TTL
- Stale window: 5 minutes (returns stale data while refreshing in background)
- Cache headers indicate source and staleness via `X-Cache-Source` and `X-Cache-Stale`

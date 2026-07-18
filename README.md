# ContestStack

ContestStack helps you keep track of upcoming programming contests from popular competitive programming platforms in one place.

You can:

* 📅 View upcoming contests
* 🔍 Filter contests by platform and difficulty
* 🗓️ Add contests to your calendar
* ⏰ Stay organized and never miss a competition

## Supported Platforms

* LeetCode
* Codeforces
* CodeChef
* AtCoder
* GeeksforGeeks (GFG)
* Coding Ninjas
* HackerEarth
* HackerRank


## Live Demo

* https://conteststack.vercel.app/contests
* https://contests-io.vercel.app/contests

## API

* `GET /api/contests?month=4&year=2026` — Retrieve upcoming contests.
* `POST /api/refresh?rebuild=true` — Refresh the contests cache.

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Material UI
* Upstash Redis

## License

MIT

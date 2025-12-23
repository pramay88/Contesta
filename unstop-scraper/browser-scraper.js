// Improved Unstop Browser Scraper
// Run this in browser console on https://unstop.com/hackathons
// Instructions: Open console (F12), paste this code, press Enter

(function () {
    console.log('Starting Unstop scraper...');
    const contests = [];

    // Try multiple possible selectors for Unstop's card layout
    const selectors = [
        'div[class*="card"]',
        'article',
        'div[class*="opportunity"]',
        'div[class*="challenge"]',
        'a[href*="/hackathons/"]',
        'div[class*="item"]',
        '.card',
        '[data-testid*="card"]'
    ];

    let cards = [];
    for (const selector of selectors) {
        cards = document.querySelectorAll(selector);
        if (cards.length > 0) {
            console.log(`Found ${cards.length} elements with selector: ${selector}`);
            break;
        }
    }

    if (cards.length === 0) {
        console.error('No cards found! The page structure may have changed.');
        console.log('Available elements:', document.body.innerHTML.substring(0, 500));
        return;
    }

    cards.forEach((card, index) => {
        try {
            // Try to find title
            let title = '';
            const titleSelectors = ['h1', 'h2', 'h3', 'h4', '[class*="title"]', '[class*="name"]', 'a'];
            for (const sel of titleSelectors) {
                const el = card.querySelector(sel);
                if (el && el.textContent.trim().length > 3) {
                    title = el.textContent.trim();
                    break;
                }
            }

            // Try to find URL
            let href = '';
            const link = card.querySelector('a[href*="/hackathons/"], a[href*="/competitions/"]') ||
                card.querySelector('a') ||
                card.closest('a');

            if (link) {
                href = link.href;
            } else if (card.tagName === 'A') {
                href = card.href;
            }

            // Try to find date
            let dateText = '';
            const dateSelectors = ['time', '[class*="date"]', '[class*="deadline"]', '[datetime]'];
            for (const sel of dateSelectors) {
                const el = card.querySelector(sel);
                if (el) {
                    dateText = el.textContent.trim() || el.getAttribute('datetime') || '';
                    if (dateText) break;
                }
            }

            // Only add if we have at least title and URL
            if (title && href && !href.includes('javascript:')) {
                // Parse date if available
                let startDate = new Date().toISOString();
                let endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

                if (dateText) {
                    try {
                        const parsed = new Date(dateText);
                        if (!isNaN(parsed.getTime())) {
                            startDate = parsed.toISOString();
                            endDate = new Date(parsed.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
                        }
                    } catch (e) {
                        // Keep default dates
                    }
                }

                contests.push({
                    event: title,
                    start: startDate,
                    end: endDate,
                    resource: 'unstop.com',
                    href: href,
                    dateText: dateText || 'No date found'
                });
            }
        } catch (err) {
            console.warn(`Error parsing card ${index}:`, err.message);
        }
    });

    // Remove duplicates by URL
    const uniqueContests = [];
    const seenUrls = new Set();

    contests.forEach(contest => {
        if (!seenUrls.has(contest.href)) {
            seenUrls.add(contest.href);
            uniqueContests.push(contest);
        }
    });

    const output = {
        contests: uniqueContests,
        lastUpdated: new Date().toISOString(),
        source: window.location.href,
        note: "Update this file periodically to keep contests fresh"
    };

    console.log('\n=== COPY THE JSON BELOW ===\n');
    console.log(JSON.stringify(output, null, 2));
    console.log('\n=== END OF JSON ===\n');
    console.log(`✅ Found ${uniqueContests.length} unique contests`);

    if (uniqueContests.length > 0) {
        console.log('\nFirst 3 contests:');
        uniqueContests.slice(0, 3).forEach((c, i) => {
            console.log(`${i + 1}. ${c.event}`);
            console.log(`   URL: ${c.href}`);
            console.log(`   Date: ${c.dateText}`);
        });
    }

    console.log('\n📋 Copy the JSON above and paste it into unstop-contests.json');

    return output;
})();

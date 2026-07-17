import Link from 'next/link';
import { AppSection } from '@/components/AppSection';
import { SiteFooter } from '@/components/SiteFooter';

const FAQS = [
    {
        question: 'How does ContestForge collect contest data?',
        answer: 'It aggregates public contest feeds and normalizes them into one consistent timeline and list experience.',
    },
    {
        question: 'Can I use it without an account?',
        answer: 'Yes. The core feed is public, fast, and designed to be useful immediately without sign-up friction.',
    },
    {
        question: 'Will more modules be added later?',
        answer: 'Yes. The UI and data model are structured so reminders, profiles, and analytics can be added without redesigning the app.',
    },
] as const;

const CREDITS = [
    'Codeforces',
    'LeetCode',
    'AtCoder',
    'CodeChef',
    'HackerRank',
    'HackerEarth',
    'TopCoder',
    'Kaggle',
] as const;

export default function AboutPage() {
    return (
        <main className="bg-(--bg-page)">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:px-6 lg:py-10">
                <section className="rounded-4xl border p-6 md:p-10" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="max-w-3xl space-y-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-(--text-muted)">About</div>
                        <h1 className="text-4xl font-semibold tracking-tight text-(--text-primary) md:text-5xl">Built by contest people, for contest people.</h1>
                        <p className="max-w-2xl text-base leading-7 text-(--text-secondary) md:text-lg">
                            ContestForge started as a weekend scraper and became a clean, focused developer tool. The goal is simple: make contest discovery feel obvious, fast, and calm.
                        </p>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                    <AppSection eyebrow="Story" title="What this app is trying to be">
                        <div className="space-y-4 text-sm leading-7 text-(--text-secondary)">
                            <p>
                                We wanted one place to check the public contest feeds you already use, without jumping between tabs or spreadsheets.
                                This app is designed to scale into a larger developer platform while keeping contests as the center of gravity.
                            </p>
                            <p>
                                The interface is intentionally opinionated: a shared shell, consistent layouts, and configuration-driven platform metadata.
                                That makes future features like reminders, profiles, and analytics easy to add without redoing the foundation.
                            </p>
                        </div>
                    </AppSection>

                    <div className="grid gap-6">
                        <AppSection eyebrow="At a glance" title="Current shape">
                            <dl className="space-y-4 text-sm">
                                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                                    <dt className="text-(--text-muted)">Product</dt>
                                    <dd className="font-medium text-(--text-primary)">ContestForge</dd>
                                </div>
                                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                                    <dt className="text-(--text-muted)">Version</dt>
                                    <dd className="font-medium text-(--text-primary)">v0.4.2</dd>
                                </div>
                                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                                    <dt className="text-(--text-muted)">Focus</dt>
                                    <dd className="font-medium text-(--text-primary)">Contests</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-(--text-muted)">Roadmap-ready</dt>
                                    <dd className="font-medium text-(--text-primary)">Yes</dd>
                                </div>
                            </dl>
                        </AppSection>

                        <AppSection eyebrow="FAQ" title="Common questions" description="Answers that used to live on the homepage.">
                            <div className="space-y-3">
                                {FAQS.map((faq) => (
                                    <details key={faq.question} className="group rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-card-hover)' }}>
                                        <summary className="cursor-pointer list-none font-medium text-(--text-primary)">{faq.question}</summary>
                                        <p className="mt-3 text-sm leading-6 text-(--text-secondary)">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </AppSection>

                        <AppSection eyebrow="Contact" title="Get in touch" description="Feedback, bugs, or a platform we should add?">
                            <div id="contact" className="space-y-4 text-sm text-(--text-secondary)">
                                <p>Use the dedicated contact page to send feedback, questions, or testimonials. We can store them and reuse the best ones in the app.</p>
                                <Link href="/contact" className="inline-flex rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white">Open contact page</Link>
                            </div>
                        </AppSection>
                    </div>
                </div>

                <AppSection id="credits" eyebrow="Credits" title="Data sources and tooling">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <p className="text-sm leading-7 text-(--text-secondary)">
                                Contest data is aggregated from public APIs and community feeds. UI is built with React, Next.js, Tailwind, Lucide, and the app’s shared design system.
                            </p>
                        </div>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-(--text-secondary)">
                            {CREDITS.map((item) => (
                                <li key={item} className="rounded-full border px-3 py-2 text-center" style={{ borderColor: 'var(--border)' }}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </AppSection>

                <SiteFooter />
            </div>
        </main>
    );
}

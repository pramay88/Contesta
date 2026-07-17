import Link from 'next/link';
import { AppSection } from '@/components/AppSection';
import { PlatformMarquee } from '@/components/PlatformMarquee';
import { SiteFooter } from '@/components/SiteFooter';

const FAQS = [
    {
        question: 'How does Contesta.io get its contest data?',
        answer: "It pulls from each platform's public contest feed and normalizes the mess into one consistent schema — because every platform formats dates like it's the only platform that exists.",
    },
    {
        question: 'Do I need an account?',
        answer: "No. The core feed is public. If a product makes you sign up before showing you anything, that's not a login wall, that's a bounce generator.",
    },
    {
        question: "Why isn't my favorite platform listed yet?",
        answer: "Probably because I haven't gotten to it, not because I forgot it exists. Tell me on the contact page and it moves up the queue.",
    },
    {
        question: 'Is this going to turn into a bloated dashboard?',
        answer: "The roadmap adds reminders and profiles, not fourteen sidebar items you'll never click. Contests stay the center of gravity.",
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
            <div className="mx-auto flex max-w-[1300px] flex-col gap-16 px-4 py-14 md:px-6 lg:py-20">

                <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
                    {/* Hero / story */}
                    <section className="mx-auto max-w-4xl text-center">
                        {/* <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-lg border border-(--border) bg-(--bg-card) px-3 py-1.5 font-mono text-xs font-medium text-(--text-secondary)">
                        About
                    </div> */}
                        <span className='text-5xl'>
                            About{" "}
                            <span className="font-mono text-5xl font-bold tracking-tight text-(--text-primary)">
                                Contest<span className="text-(--accent)">Forge</span>
                            </span>
                        </span>

                        <div className="mt-6 space-y-4 text-center text-base leading-7 text-(--text-secondary) md:text-lg">
                            <p>
                                Started as a hobby project to gather all the contests happening
                                around the internet in one place.
                            </p>
                            <p>
                                But as time passed, I realized it could be a great tool for people who are
                                actually looking for contests to participate in.
                            </p>

                        </div>
                    </section>


                    {/* Contact */}
                    <AppSection title="Found a bug? Have a Question?">
                        <div className="space-y-4 text-sm text-(--text-secondary)">
                            <p>The contact page takes feedback, questions, and platform requests directly.</p>
                            <Link
                                href="/contact"
                                className="inline-flex rounded-lg bg-(--accent) px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                            >
                                Open contact page
                            </Link>
                        </div>
                    </AppSection>
                </div>

                <SiteFooter />
            </div>
        </main>
    );
}
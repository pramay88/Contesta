import { AppSection } from '@/components/AppSection';
import { ContactForm } from '@/components/ContactForm';
import { SiteFooter } from '@/components/SiteFooter';

export default function ContactPage() {
    return (
        <main className="bg-(--bg-page)">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-8 md:px-6 lg:py-10">
                <section className="rounded-4xl border p-6 md:p-10" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                    <div className="max-w-3xl space-y-4">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-(--text-muted)">Contact</div>
                        <h1 className="text-4xl font-semibold tracking-tight text-(--text-primary) md:text-5xl">Send feedback, questions, or testimonials.</h1>
                        <p className="max-w-2xl text-base leading-7 text-(--text-secondary) md:text-lg">
                            Use this page to tell us what works, what’s confusing, or what should be added next. Submissions are stored for review and can be used to improve the app.
                        </p>
                    </div>
                </section>

                <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
                    <ContactForm />

                    <div className="space-y-6">
                        <AppSection eyebrow="What you can send" title="Use cases">
                            <div className="space-y-3 text-sm leading-7 text-(--text-secondary)">
                                <p><span className="font-medium text-(--text-primary)">Feedback:</span> report bugs, request features, or suggest UI improvements.</p>
                                <p><span className="font-medium text-(--text-primary)">Questions:</span> ask about supported platforms, data refresh, or roadmap items.</p>
                                <p><span className="font-medium text-(--text-primary)">Testimonials:</span> share what you like so it can be surfaced in the product later.</p>
                            </div>
                        </AppSection>

                        <AppSection eyebrow="Privacy" title="How messages are handled">
                            <div className="space-y-3 text-sm leading-7 text-(--text-secondary)">
                                <p>Messages are stored in Redis-backed storage when configured. The submission log keeps the latest entries available for internal review.</p>
                                <p>If you want, I can also add a small admin view that lists the newest messages inside the app.</p>
                            </div>
                        </AppSection>
                    </div>
                </div>

                <SiteFooter />
            </div>
        </main>
    );
}

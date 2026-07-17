import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";

export default function ContactPage() {
    return (
        <main className="bg-(--bg-page)">
            <div className="mx-auto flex max-w-[1300px] flex-col gap-10 px-4 py-10 md:px-6">
                {/* Centered Content */}
                <div className="flex flex-col items-center gap-10">
                    <section className="max-w-2xl space-y-3 text-center">
                        <h1 className="text-3xl font-semibold tracking-tight text-(--text-primary) md:text-4xl">
                            We&apos;d love to hear from you.
                        </h1>

                        <p className="text-base leading-7 text-(--text-secondary)">
                            Have a question, found a bug, want to suggest a feature. Send us a message and we&apos;ll
                            get back to you as soon as possible.
                        </p>
                    </section>

                    <section className="w-full max-w-2xl">
                        <ContactForm />
                    </section>
                </div>

                <SiteFooter />
            </div>
        </main>
    );
}
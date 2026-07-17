'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

type ContactType = 'feedback' | 'question' | 'testimonial';

const OPTIONS: Array<{ value: ContactType; label: string; description: string }> = [
    { value: 'feedback', label: 'Feedback', description: 'Ideas, bug reports, and product notes.' },
    { value: 'question', label: 'Question', description: 'Ask about the feed, platforms, or roadmap.' },
    { value: 'testimonial', label: 'Testimonial', description: 'Share what you like and what should stay.' },
];

export function ContactForm() {
    const [type, setType] = useState<ContactType>('feedback');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('saving');
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, name, email, subject, message }),
            });

            const data = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit the form.');
            }

            setStatus('success');
            setName('');
            setEmail('');
            setSubject('');
            setMessage('');
            setType('feedback');
        } catch (submitError) {
            setStatus('error');
            setError(submitError instanceof Error ? submitError.message : 'Failed to submit the form.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border p-6 md:p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="grid gap-3 sm:grid-cols-3">
                {OPTIONS.map((option) => {
                    const active = type === option.value;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setType(option.value)}
                            className="rounded-2xl border p-4 text-left transition-colors"
                            style={{ borderColor: active ? 'var(--accent)' : 'var(--border)', background: active ? 'var(--accent-light)' : 'var(--bg-card-hover)' }}
                        >
                            <div className="text-sm font-semibold text-(--text-primary)">{option.label}</div>
                            <div className="mt-1 text-xs leading-5 text-(--text-secondary)">{option.description}</div>
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                    <span className="font-medium text-(--text-primary)">Name</span>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        className="w-full rounded-2xl border px-4 py-3 outline-none"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                        placeholder="Your name"
                    />
                </label>

                <label className="space-y-2 text-sm">
                    <span className="font-medium text-(--text-primary)">Email</span>
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        className="w-full rounded-2xl border px-4 py-3 outline-none"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                        placeholder="you@example.com"
                    />
                </label>
            </div>

            <label className="space-y-2 text-sm block">
                <span className="font-medium text-(--text-primary)">Subject</span>
                <input
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                    required
                    className="w-full rounded-2xl border px-4 py-3 outline-none"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    placeholder="What would you like to share?"
                />
            </label>

            <label className="space-y-2 text-sm block">
                <span className="font-medium text-(--text-primary)">Message</span>
                <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    required
                    rows={7}
                    className="w-full rounded-2xl border px-4 py-3 outline-none"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    placeholder="Share feedback, ask a question, or leave a testimonial."
                />
            </label>

            {status === 'success' && (
                <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: 'rgba(34, 197, 94, 0.3)', background: 'rgba(34, 197, 94, 0.08)', color: 'var(--text-primary)' }}>
                    Thanks. Your message was saved and can be reused to improve the app.
                </div>
            )}

            {status === 'error' && (
                <div className="rounded-2xl border px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={status === 'saving'}
                className="inline-flex items-center gap-2 rounded-full bg-(--accent) px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
                <Send className="h-4 w-4" />
                {status === 'saving' ? 'Sending...' : 'Send message'}
            </button>
        </form>
    );
}

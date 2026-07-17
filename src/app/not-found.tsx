import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-(--bg-page) px-4">
            <div className="max-w-lg rounded-[28px] border p-8 text-center" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">404</div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">Page not found</h1>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    The page you requested doesn’t exist. The contest feed is still here if you need it.
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    <Link href="/" className="rounded-full border px-4 py-2 text-sm font-medium text-[var(--text-primary)]" style={{ borderColor: 'var(--border)' }}>
                        Go home
                    </Link>
                    <Link href="/contests" className="rounded-full bg-(--accent) px-4 py-2 text-sm font-semibold text-white">
                        Open contests
                    </Link>
                </div>
            </div>
        </main>
    );
}

import type { HTMLAttributes, ReactNode } from 'react';

interface AppSectionProps extends HTMLAttributes<HTMLElement> {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
    children: ReactNode;
}

export function AppSection({ eyebrow, title, description, actions, children, ...props }: AppSectionProps) {
    return (
        <section className="rounded-3xl border p-5 md:p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }} {...props}>
            {(eyebrow || title || description || actions) && (
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-2">
                        {eyebrow && <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-(--text-muted)">{eyebrow}</div>}
                        <h2 className="text-2xl font-semibold tracking-tight text-(--text-primary)">{title}</h2>
                        {description && <p className="max-w-2xl text-sm text-(--text-secondary)">{description}</p>}
                    </div>
                    {actions}
                </div>
            )}
            {children}
        </section>
    );
}

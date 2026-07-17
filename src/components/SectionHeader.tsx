import type { ReactNode } from 'react';

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, actions }: SectionHeaderProps) {
    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
                {eyebrow && <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">{eyebrow}</div>}
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
                {description && <p className="max-w-2xl text-sm text-[var(--text-secondary)]">{description}</p>}
            </div>
            {actions}
        </div>
    );
}

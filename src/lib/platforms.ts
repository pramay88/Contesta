export type PlatformContext = 'contest' | 'hackathon';

type PlatformDefinition = {
    label: string;
    color: string;
    contexts: readonly PlatformContext[];
    aliases?: readonly string[];
};

export const PLATFORM_REGISTRY = {
    'leetcode.com': {
        label: 'LeetCode',
        color: '#f89f1b',
        contexts: ['contest'],
        aliases: ['leetcode'],
    },
    'codeforces.com': {
        label: 'Codeforces',
        color: '#3b82f6',
        contexts: ['contest'],
        aliases: ['codeforces'],
    },
    'codechef.com': {
        label: 'CodeChef',
        color: '#7c3aed',
        contexts: ['contest'],
        aliases: ['codechef'],
    },
    'geeksforgeeks.org': {
        label: 'GFG',
        color: '#16a34a',
        contexts: ['contest'],
        aliases: ['gfg', 'geeksforgeeks'],
    },
    'atcoder.jp': {
        label: 'AtCoder',
        color: '#0ea5e9',
        contexts: ['contest'],
        aliases: ['atcoder'],
    },
    'naukri.com/code360': {
        label: 'Code360',
        color: '#8b5cf6',
        contexts: ['contest'],
        aliases: ['code360', 'codingninjas.com/code360'],
    },
    devpost: {
        label: 'Devpost',
        color: '#2563eb',
        contexts: ['hackathon'],
        aliases: ['devpost.com'],
    },
    unstop: {
        label: 'Unstop',
        color: '#7c3aed',
        contexts: ['hackathon'],
        aliases: ['unstop.com'],
    },
    kaggle: {
        label: 'Kaggle',
        color: '#06b6d4',
        contexts: ['hackathon'],
        aliases: ['kaggle.com'],
    },
} as const satisfies Record<string, PlatformDefinition>;

type PlatformRegistry = typeof PLATFORM_REGISTRY;
export type PlatformId = keyof PlatformRegistry;

export type PlatformIdsForContext<TContext extends PlatformContext> = {
    [TPlatform in PlatformId]: TContext extends PlatformRegistry[TPlatform]['contexts'][number]
    ? TPlatform
    : never;
}[PlatformId];

export interface PlatformOption<TPlatform extends PlatformId = PlatformId> {
    value: TPlatform;
    label: string;
}

const PLATFORM_ENTRIES = Object.entries(PLATFORM_REGISTRY) as [PlatformId, PlatformDefinition][];

export function getPlatformDefinition(platformId: string): PlatformDefinition | null {
    const normalized = platformId.toLowerCase().trim();

    for (const [id, definition] of PLATFORM_ENTRIES) {
        if (id === normalized || definition.aliases?.includes(normalized)) {
            return definition;
        }
    }

    return null;
}

export function getPlatformLabel(platformId: string): string {
    return getPlatformDefinition(platformId)?.label ?? platformId;
}

export function getPlatformColor(platformId: string): string {
    return getPlatformDefinition(platformId)?.color ?? '#6b7280';
}

export function getPlatformOptions<TContext extends PlatformContext>(context: TContext): PlatformOption<PlatformIdsForContext<TContext>>[] {
    return PLATFORM_ENTRIES.filter(([, definition]) => definition.contexts.includes(context)).map(
        ([id, definition]) => ({
            value: id as PlatformIdsForContext<TContext>,
            label: definition.label,
        })
    );
}

export function getPlatformIds<TContext extends PlatformContext>(context: TContext): PlatformIdsForContext<TContext>[] {
    return getPlatformOptions(context).map((option) => option.value);
}

export function normalizePlatformId(platformId: string, context?: PlatformContext): PlatformId | null {
    const normalized = platformId.toLowerCase().trim();

    for (const [id, definition] of PLATFORM_ENTRIES) {
        const matches = id === normalized || definition.aliases?.includes(normalized);
        if (!matches) {
            continue;
        }

        if (context && !definition.contexts.includes(context)) {
            return null;
        }

        return id;
    }

    return null;
}

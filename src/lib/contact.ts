import { getRedis } from '@/lib/cache';

export type ContactSubmissionType = 'feedback' | 'question' | 'testimonial';

export interface ContactSubmission {
    id: string;
    type: ContactSubmissionType;
    name: string;
    email?: string;
    subject: string;
    message: string;
    createdAt: string;
}

const CONTACT_SUBMISSIONS_KEY = 'contact:submissions';
const CONTACT_SUBMISSIONS_COUNT_KEY = 'contact:submissions:count';
const MAX_STORED_SUBMISSIONS = 200;

export interface ContactSubmissionInput {
    type: ContactSubmissionType;
    name: string;
    email?: string;
    subject: string;
    message: string;
}

export function validateContactSubmission(input: Partial<ContactSubmissionInput>): ContactSubmissionInput | null {
    const type = input.type;
    const name = input.name?.trim();
    const subject = input.subject?.trim();
    const message = input.message?.trim();
    const email = input.email?.trim();

    if (!type || !['feedback', 'question', 'testimonial'].includes(type)) {
        return null;
    }

    if (!name || name.length < 2 || name.length > 80) {
        return null;
    }

    if (!subject || subject.length < 3 || subject.length > 120) {
        return null;
    }

    if (!message || message.length < 10 || message.length > 2000) {
        return null;
    }

    if (email && email.length > 120) {
        return null;
    }

    return {
        type,
        name,
        email: email || undefined,
        subject,
        message,
    };
}

export async function storeContactSubmission(input: ContactSubmissionInput): Promise<ContactSubmission | null> {
    const redis = getRedis();

    if (!redis) {
        return null;
    }

    const submission: ContactSubmission = {
        id: crypto.randomUUID(),
        type: input.type,
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
        createdAt: new Date().toISOString(),
    };

    await redis.lpush(CONTACT_SUBMISSIONS_KEY, JSON.stringify(submission));
    await redis.ltrim(CONTACT_SUBMISSIONS_KEY, 0, MAX_STORED_SUBMISSIONS - 1);
    await redis.incr(CONTACT_SUBMISSIONS_COUNT_KEY);

    return submission;
}

export async function getContactSubmissionStats(): Promise<{ total: number; recent: ContactSubmission[] }> {
    const redis = getRedis();

    if (!redis) {
        return { total: 0, recent: [] };
    }

    const [total, recent] = await Promise.all([
        redis.get<number>(CONTACT_SUBMISSIONS_COUNT_KEY),
        redis.lrange<string>(CONTACT_SUBMISSIONS_KEY, 0, 4),
    ]);

    return {
        total: Number(total ?? 0),
        recent: recent.map((item) => JSON.parse(item) as ContactSubmission),
    };
}

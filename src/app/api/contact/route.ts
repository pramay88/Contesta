import { NextRequest, NextResponse } from 'next/server';
import { getContactSubmissionStats, storeContactSubmission, validateContactSubmission } from '@/lib/contact';

export async function GET() {
    const stats = await getContactSubmissionStats();

    return NextResponse.json({
        total: stats.total,
        recent: stats.recent,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as Record<string, unknown>;
        const submission = validateContactSubmission({
            type: body.type as 'feedback' | 'question' | 'testimonial' | undefined,
            name: typeof body.name === 'string' ? body.name : undefined,
            email: typeof body.email === 'string' ? body.email : undefined,
            subject: typeof body.subject === 'string' ? body.subject : undefined,
            message: typeof body.message === 'string' ? body.message : undefined,
        });

        if (!submission) {
            return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
        }

        const saved = await storeContactSubmission(submission);

        if (!saved) {
            return NextResponse.json(
                { error: 'Contact storage is not configured. Set Upstash Redis to collect submissions.' },
                { status: 503 }
            );
        }

        return NextResponse.json({ success: true, submission: saved });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to submit contact form', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

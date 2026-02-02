
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shortId, timestamp, ua, country } = body;

        if (shortId) {
            const { updateStats } = await import('@/lib/cf');
            await updateStats(shortId, ua || 'backend', country || 'Unknown');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

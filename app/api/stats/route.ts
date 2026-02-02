
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const shortId = searchParams.get('shortId');

    if (!shortId) {
        return NextResponse.json({ error: 'Short ID is required' }, { status: 400 });
    }

    const token = process.env.TINYBIRD_TOKEN;
    if (!token) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    try {
        const { getStats } = await import('@/lib/cf');
        const stats = await getStats(shortId);

        if (!stats) {
            return NextResponse.json({
                summary: { total: 0, unique_visitors: 0 },
                countries: [],
                timeline: [],
                os: []
            });
        }

        // Transform KV stats to match frontend expectation
        const osArray = Object.entries(stats.os || {}).map(([k, v]) => ({ os: k, count: v as number }));
        const countryArray = Object.entries(stats.countries || {}).map(([k, v]) => ({ country: k, count: v as number }));
        const browserArray = Object.entries(stats.browsers || {}).map(([k, v]) => ({ name: k, count: v as number }));
        const deviceArray = Object.entries(stats.devices || {}).map(([k, v]) => ({ name: k, count: v as number }));

        // Ensure timeline is sorted
        const timelineArray = (stats.timeline || []).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json({
            summary: { total: stats.total || 0, unique_visitors: stats.total || 0 }, // Simplified unique
            countries: countryArray,
            timeline: timelineArray,
            os: osArray,
            browsers: browserArray,
            devices: deviceArray
        });

    } catch (error) {
        console.error("Stats API Error", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}

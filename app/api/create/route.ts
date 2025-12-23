import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { storeLink, getShortIdByUrl } from '@/lib/cf';

export const runtime = 'edge';

// Tinybird Event - Creation Log
async function logCreationEvent(shortId: string, longUrl: string) {
    const analyticsUrl = 'https://api.europe-west2.gcp.tinybird.co/v0/events?name=qr_scans';
    const token = process.env.TINYBIRD_TOKEN;

    if (token) {
        await fetch(analyticsUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shortId: shortId,
                country: 'CREATION', // Flag
                ua: 'System',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            })
        }).catch(err => console.error("TB Error", err));
    }
}

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Check if we already have a shortId for this URL
        const existingShortId = await getShortIdByUrl(url);

        if (existingShortId) {
            console.log(`URL already exists in KV: ${url} -> ${existingShortId}`);
            return NextResponse.json({
                shortId: existingShortId,
                shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/s/${existingShortId}`,
                isNew: false
            });
        }

        // 2. Generate new if not exists
        const shortId = nanoid(7);

        // Run in parallel
        await Promise.all([
            storeLink(shortId, url),
            logCreationEvent(shortId, url)
        ]);

        return NextResponse.json({
            shortId,
            shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortId}`,
            isNew: true
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

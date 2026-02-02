import { nanoid } from 'nanoid';
import { NextRequest, NextResponse } from 'next/server';
import { storeLink, getShortIdByUrl } from '@/lib/cf';

export const runtime = 'edge';

// Tinybird Event - Creation Log
async function logCreationEvent(shortId: string, longUrl: string, email?: string) {
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
                email: email || 'anonymous',
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            })
        }).catch(err => console.error("TB Error", err));
    }
}

export async function POST(req: NextRequest) {
    try {
        const { url, email } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Check if we already have a shortId for this URL
        const existingShortId = await getShortIdByUrl(url);

        if (existingShortId) {
            console.log(`URL already exists in KV: ${url} -> ${existingShortId}`);
            // Force re-association with email in case it's a new user using same link
            // Actually, getShortIdByUrl just returns shortId. We should probably add this shortId to user's email list too.
            // But storeLink handles email append safely. Let's call storeLink again to ensure email link.
            await storeLink(existingShortId, url, email);

            return NextResponse.json({
                shortId: existingShortId,
                shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/s/${existingShortId}`,
                isNew: false
            });
        }

        // 2. Generate new if not exists
        const shortId = nanoid(7);

        // 3. Store
        await storeLink(shortId, url, email);

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

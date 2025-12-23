
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shortId, timestamp, ua, country } = body;

        // --- PROXY TO TINYBIRD ---
        // Using 'scans_v2' which we created successfully.
        const analyticsUrl = 'https://api.europe-west2.gcp.tinybird.co/v0/events?name=scans_v2';
        const tinybirdToken = process.env.TINYBIRD_TOKEN;

        if (tinybirdToken) {
            // NDJSON Format: JSON object + newline
            const ndjsonRow = JSON.stringify({
                shortId: shortId || 'unknown',
                timestamp: timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
                ua: ua || 'backend',
                country: country || 'Unknown',
            }) + '\n';

            // Fire request
            await fetch(analyticsUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tinybirdToken}`,
                    'Content-Type': 'application/json'
                },
                body: ndjsonRow
            }).catch(e => console.error("TB Error:", e));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics Error", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

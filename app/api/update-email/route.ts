import { NextRequest, NextResponse } from 'next/server';
import { storeLink, getLink } from '@/lib/cf';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    try {
        const { shortId, email } = await req.json();

        if (!shortId || !email) {
            return NextResponse.json({ error: 'ShortId and Email are required' }, { status: 400 });
        }

        // 1. Verify link exists
        const longUrl = await getLink(shortId);
        if (!longUrl) {
            return NextResponse.json({ error: 'Link not found' }, { status: 404 });
        }

        // 2. Associate email
        await storeLink(shortId, longUrl, email);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Update Email Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

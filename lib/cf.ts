const CF_ACCOUNT = process.env.CF_ACCOUNT_ID;
const CF_NAMESPACE = process.env.CF_NAMESPACE_ID;
const CF_TOKEN = process.env.CF_API_TOKEN;

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/storage/kv/namespaces/${CF_NAMESPACE}`;

// Helper to hash URL for consistent KV keys
async function hashUrl(url: string) {
    const msgUint8 = new TextEncoder().encode(url);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// WRITE: Helper to save a Short Link -> Long URL with optional reverse mapping
export async function storeLink(shortId: string, longUrl: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) {
        throw new Error("Missing Cloudflare Environment Variables");
    }

    // Key 1: shortId -> longUrl
    const putShort = fetch(`${BASE_URL}/values/${shortId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${CF_TOKEN}`,
            'Content-Type': 'text/plain',
        },
        body: longUrl
    });

    // Key 2: u:[hash] -> shortId
    const hashed = await hashUrl(longUrl);
    const urlKey = `u:${hashed}`;

    const putReverse = fetch(`${BASE_URL}/values/${urlKey}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${CF_TOKEN}`,
            'Content-Type': 'text/plain',
        },
        body: shortId
    });

    const [res1, res2] = await Promise.all([putShort, putReverse]);

    return res1.ok && res2.ok;
}

// READ: Helper to find shortId by Long URL
export async function getShortIdByUrl(longUrl: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) return null;

    const hashed = await hashUrl(longUrl);
    const urlKey = `u:${hashed}`;

    const res = await fetch(`${BASE_URL}/values/${urlKey}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` }
    });

    if (!res.ok) return null;
    return res.text();
}

// READ: Helper used by Server Actions (optional, as Middleware does the heavy lifting)
export async function getLink(shortId: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) return null;

    const res = await fetch(`${BASE_URL}/values/${shortId}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` }
    });

    if (!res.ok) return null;
    return res.text();
}

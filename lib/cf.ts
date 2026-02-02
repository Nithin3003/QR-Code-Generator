
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
export async function storeLink(shortId: string, longUrl: string, email?: string) {
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

    // Key 3: email:[email] -> [shortIds] (Append)
    let putEmail = Promise.resolve();
    if (email) {
        const emailKey = `email:${email}`;
        // 1. Get existing
        putEmail = (async () => {
            const res = await fetch(`${BASE_URL}/values/${emailKey}`, { headers: { 'Authorization': `Bearer ${CF_TOKEN}` } });
            let list = [];
            if (res.ok) {
                try { list = await res.json(); } catch { }
            }
            if (!list.includes(shortId)) {
                list.unshift(shortId); // Add to top
                await fetch(`${BASE_URL}/values/${emailKey}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${CF_TOKEN}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify(list)
                });
            }
        })();
    }

    // Initialize Empty Stats Object
    const statsKey = `stats:${shortId}`;
    const initialStats = JSON.stringify({
        total: 0,
        timeline: [],
        os: {},
        browsers: {},
        devices: {},
        countries: {}
    });

    // We only write stats if it doesn't exist, effectively
    // But since storeLink is called on create, we can just init it.
    // However, storeLink is also called to upsert? No, mostly create.
    const putStats = fetch(`${BASE_URL}/values/${statsKey}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${CF_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: initialStats
    });

    const [res1, res2] = await Promise.all([putShort, putReverse, putStats, putEmail]);

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

// READ: Helper used by Server Actions
export async function getLink(shortId: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) return null;

    const res = await fetch(`${BASE_URL}/values/${shortId}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` }
    });

    if (!res.ok) return null;
    return res.text();
}

// TRACKING: Own Logic using KV
export async function updateStats(shortId: string, ua: string, country: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) return;

    const key = `stats:${shortId}`;

    // 1. Fetch existing stats
    const res = await fetch(`${BASE_URL}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` }
    });

    let stats = { total: 0, timeline: [] as any[], os: {} as any, countries: {} as any, browsers: {} as any, devices: {} as any };
    if (res.ok) {
        try {
            stats = await res.json();
            // Create fields if not exist (migration)
            if (!stats.browsers) stats.browsers = {};
            if (!stats.devices) stats.devices = {};
        } catch { }
    }

    // 2. Update logic
    stats.total = (stats.total || 0) + 1;

    // OS Logic
    let osName = 'Other';
    if (ua.includes('Android')) osName = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) osName = 'iOS';
    else if (ua.includes('Windows')) osName = 'Windows';
    else if (ua.includes('Mac')) osName = 'MacOS';
    else if (ua.includes('Linux')) osName = 'Linux';
    stats.os[osName] = (stats.os[osName] || 0) + 1;

    // Browser Logic
    let browserName = 'Other';
    if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) browserName = 'Chrome';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browserName = 'Safari';
    else if (ua.includes('Firefox')) browserName = 'Firefox';
    else if (ua.includes('Edg')) browserName = 'Edge';
    else if (ua.includes('OPR')) browserName = 'Opera';
    stats.browsers[browserName] = (stats.browsers[browserName] || 0) + 1;

    // Device Logic
    let deviceType = 'Desktop';
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) deviceType = 'Mobile';
    stats.devices[deviceType] = (stats.devices[deviceType] || 0) + 1;

    // Timeline Logic
    const today = new Date().toISOString().split('T')[0];
    const dayEntry = stats.timeline.find(t => t.date === today);
    if (dayEntry) {
        dayEntry.count++;
    } else {
        stats.timeline.push({ date: today, count: 1 });
    }

    // Country Logic
    const c = country === 'Unknown-Client' ? 'Unknown' : country;
    stats.countries[c] = (stats.countries[c] || 0) + 1;

    // 3. Save back
    await fetch(`${BASE_URL}/values/${key}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${CF_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(stats)
    });
}

// READ STATS
export async function getStats(shortId: string) {
    const key = `stats:${shortId}`;
    const res = await fetch(`${BASE_URL}/values/${key}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` },
        cache: 'no-store'
    });

    if (!res.ok) return null;
    return await res.json();
}

// READ QRs by Email
export async function getLinksByEmail(email: string) {
    if (!CF_ACCOUNT || !CF_NAMESPACE || !CF_TOKEN) return [];

    const emailKey = `email:${email}`;
    const res = await fetch(`${BASE_URL}/values/${emailKey}`, {
        headers: { 'Authorization': `Bearer ${CF_TOKEN}` },
        cache: 'no-store'
    });

    if (!res.ok) return [];
    try {
        const shortIds = await res.json();

        // Fetch details for each (in parallel)
        const detailed = await Promise.all(shortIds.map(async (id: string) => {
            const url = await getLink(id);
            // We could fetch stats too if needed for summary
            const stats = await getStats(id);
            return {
                id: id,
                shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/s/${id}`,
                url: url,
                createdAt: stats?.timeline?.[0]?.date || new Date().toISOString(), // approximate
                scans: stats?.total || 0
            };
        }));
        return detailed;
    } catch {
        return [];
    }
}

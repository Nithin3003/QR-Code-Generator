
const http = require('http');

const SHORT_ID = 'Sepc0G5';
const BASE_URL = 'http://localhost:3000';

function getStats() {
    return new Promise((resolve, reject) => {
        http.get(`${BASE_URL}/api/stats?shortId=${SHORT_ID}&_t=${Date.now()}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}

function trackScan() {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            shortId: SHORT_ID,
            ua: 'VerificationScript/1.0 (TestOS)',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
        });

        const req = http.request(`${BASE_URL}/api/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function verify() {
    try {
        console.log('--- Verifying Tracking Logic ---');

        const initial = await getStats();
        console.log(`Initial Total Scans: ${initial.summary.total}`);

        console.log('Sending Test Scan...');
        await trackScan();

        // Wait a moment for ingestion (Tinybird is fast but maybe 1-2s latency)
        console.log('Waiting 3s for ingestion...');
        await new Promise(r => setTimeout(r, 3000));

        const after = await getStats();
        console.log(`Final Total Scans:   ${after.summary.total}`);

        if (after.summary.total > initial.summary.total) {
            console.log('✅ SUCCESS: Scan count updated!');
        } else {
            console.log('⚠️  WARNING: Scan count did not update immediately (might be delayed).');
        }

    } catch (e) {
        console.error('Error:', e.message);
    }
}

verify();

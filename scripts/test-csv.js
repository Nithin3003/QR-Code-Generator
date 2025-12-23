
const https = require('https');

const token = 'p.eyJ1IjogIjFmYmUwYzAxLTg3NDctNDZkNC05M2IxLTFiODZiOTNlMjY0ZCIsICJpZCI6ICJhYzQ2YjIzNC00NjNmLTRiZGEtOTMwNy03MjlhNTM1OTM2ZDgiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.hScmwIt6BmcjumWa1Oru7a-7hEQQDbk6HcH9IKaTrYE';
const endpoint = 'https://api.europe-west2.gcp.tinybird.co/v0/events?name=qr_scans';

// CSV Format: keys... then values...
// However, /v0/events via CSV usually expects raw values if headers not specified, or we can use NDJSON...
// Wait, the error "Data Source needs to have JSONPaths defined" is very specific to JSON content type.
// Let's try sending CSV content type.

const shortId = 'CSV_TEST';
const country = 'CSV_LAND';
const ua = 'NodeJS';
const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

const data = `shortId,country,ua,timestamp\n${shortId},${country},${ua},${timestamp}`;

const url = new URL(endpoint);
const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/csv',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('Sending CSV Test Event...');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', body);
        if (res.statusCode === 200 || res.statusCode === 202) {
            console.log('✅ SUCCESS: CSV Event accepted.');
        } else {
            console.log('❌ FAILURE: Event rejected.');
        }
    });
});

req.on('error', (e) => {
    console.error('Network Error:', e);
});

req.write(data);
req.end();

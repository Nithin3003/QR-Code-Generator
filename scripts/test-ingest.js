
const https = require('https');

// Using the confirmed Admin Token from .env.local
const token = 'p.eyJ1IjogIjFmYmUwYzAxLTg3NDctNDZkNC05M2IxLTFiODZiOTNlMjY0ZCIsICJpZCI6ICJhYzQ2YjIzNC00NjNmLTRiZGEtOTMwNy03MjlhNTM1OTM2ZDgiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.hScmwIt6BmcjumWa1Oru7a-7hEQQDbk6HcH9IKaTrYE';
const endpoint = 'https://api.europe-west2.gcp.tinybird.co/v0/events?name=qr_scans';

const data = JSON.stringify({
    shortId: 'FINAL_TEST',
    country: 'TEST_LAND',
    ua: 'NodeJS Script',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
});

const url = new URL(endpoint);
const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending Test Event to Tinybird...');

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', body);
        if (res.statusCode === 200 || res.statusCode === 202) {
            console.log('✅ SUCCESS: Event accepted by Tinybird.');
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

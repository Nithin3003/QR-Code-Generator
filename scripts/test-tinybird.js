
const https = require('https');

const token = 'p.eyJ1IjogImVjOGJkYzdlLWUxMzItNGZlNy05NmNkLTk0M2Q2ZmFmZWZjYiIsICJpZCI6ICJjOTMyNDRmMC1jMGFiLTRiYTgtODQ3OC0yMzg3YWE2YjU0MWEiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.WXLP-kEi5VM1srFSOAqAZVp5EmeDaQ-5oRqtTQjHNno';
const endpoint = 'https://api.europe-west2.gcp.tinybird.co/v0/events?name=qr_scans';

const data = JSON.stringify({
    shortId: 'TEST_ID',
    country: 'TEST_COUNTRY',
    ua: 'Test Script',
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

console.log('Testing Tinybird Connection...');
console.log('URL:', endpoint);

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        console.log('Response:', body);
        if (res.statusCode === 200 || res.statusCode === 202) {
            console.log('SUCCESS: Event sent to Tinybird.');
        } else {
            console.log('FAILURE: Could not send event.');
        }
    });
});

req.on('error', (e) => {
    console.error('Network Error:', e);
});

req.write(data);
req.end();

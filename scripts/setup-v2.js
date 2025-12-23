
const https = require('https');
const querystring = require('querystring');

const token = 'p.eyJ1IjogIjFmYmUwYzAxLTg3NDctNDZkNC05M2IxLTFiODZiOTNlMjY0ZCIsICJpZCI6ICJhYzQ2YjIzNC00NjNmLTRiZGEtOTMwNy03MjlhNTM1OTM2ZDgiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.hScmwIt6BmcjumWa1Oru7a-7hEQQDbk6HcH9IKaTrYE';
const hostname = 'api.europe-west2.gcp.tinybird.co';
const NEW_DS = 'scans_v2';

function createDatasource() {
    console.log(`1. Creating FRESH datasource: ${NEW_DS}...`);

    // Explicitly using standard format
    const postData = querystring.stringify({
        name: NEW_DS,
        engine: 'MergeTree',
        engine_sorting_key: 'timestamp',
        schema: 'shortId String, country String, ua String, timestamp DateTime'
    });

    const options = {
        hostname: hostname,
        path: '/v0/datasources',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`   Create Status: ${res.statusCode}`);
            if (res.statusCode === 200) {
                console.log('✅ Datasource created.');
                setTimeout(testIngest, 2000);
            } else {
                console.log('❌ Failed to create:', body);
            }
        });
    });

    req.write(postData);
    req.end();
}

function testIngest() {
    console.log('2. Testing CSV Ingestion on NEW datasource...');

    // Use raw query param ingestion for max compatibility
    // URL: /v0/events?name=scans_v2
    // Body: The CSV data

    const shortId = 'FRESH_TEST';
    const country = 'FRESH_LAND';
    const ua = 'NodeJS';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const data = `shortId,country,ua,timestamp\n${shortId},${country},${ua},${timestamp}`;

    const options = {
        hostname: hostname,
        path: `/v0/events?name=${NEW_DS}`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'text/csv',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`   Ingest Status: ${res.statusCode}`);
            if (res.statusCode === 200 || res.statusCode === 202) {
                console.log('🎉 SUCCESS! Data accepted.');
            } else {
                console.log('❌ FAILURE:', body);
            }
        });
    });
    req.write(data);
    req.end();
}

createDatasource();

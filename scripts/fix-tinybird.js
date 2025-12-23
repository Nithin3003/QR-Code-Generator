
const https = require('https');
const querystring = require('querystring');

const token = 'p.eyJ1IjogIjFmYmUwYzAxLTg3NDctNDZkNC05M2IxLTFiODZiOTNlMjY0ZCIsICJpZCI6ICJhYzQ2YjIzNC00NjNmLTRiZGEtOTMwNy03MjlhNTM1OTM2ZDgiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.hScmwIt6BmcjumWa1Oru7a-7hEQQDbk6HcH9IKaTrYE';
const hostname = 'api.europe-west2.gcp.tinybird.co';

function createDatasource() {
    console.log('Attempting to create datasource qr_scans...');

    // Schema definition same as file
    const postData = querystring.stringify({
        name: 'qr_scans',
        engine: 'MergeTree',
        engine_sorting_key: 'timestamp',
        // Tinybird API expects schema as a string like "name Type, name2 Type"
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
            console.log(`Creation Status: ${res.statusCode}`);
            console.log('Response:', body);

            if (res.statusCode === 200) {
                console.log('Datasource created successfully. Now testing ingest...');
                testIngest();
            } else if (res.statusCode === 409) {
                console.log('Datasource already exists. Testing ingest...');
                testIngest();
            } else {
                console.log('Failed to create datasource. Token might not be Admin or schema invalid.');
            }
        });
    });

    req.write(postData);
    req.end();
}

function testIngest() {
    const data = JSON.stringify({
        shortId: 'TEST_ID_2',
        country: 'TEST_COUNTRY',
        ua: 'Test Script',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    });

    const options = {
        hostname: hostname,
        path: '/v0/events?name=qr_scans',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log(`Ingest Status: ${res.statusCode}`);
            console.log('Response:', body);
        });
    });
    req.write(data);
    req.end();
}

createDatasource();

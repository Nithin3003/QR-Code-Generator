
const https = require('https');
const querystring = require('querystring');

const token = 'p.eyJ1IjogIjFmYmUwYzAxLTg3NDctNDZkNC05M2IxLTFiODZiOTNlMjY0ZCIsICJpZCI6ICJhYzQ2YjIzNC00NjNmLTRiZGEtOTMwNy03MjlhNTM1OTM2ZDgiLCAiaG9zdCI6ICJnY3AtZXVyb3BlLXdlc3QyIn0.hScmwIt6BmcjumWa1Oru7a-7hEQQDbk6HcH9IKaTrYE';
const hostname = 'api.europe-west2.gcp.tinybird.co';

async function deleteDatasource() {
    console.log('1. Deleting existing datasource...');

    const options = {
        hostname: hostname,
        path: '/v0/datasources/qr_scans',
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            console.log(`   Delete Status: ${res.statusCode}`);
            // 204 means deleted, 404 means didn't exist (good), others are potential errors but we proceed to create
            res.resume(); // consume response
            res.on('end', resolve);
        });
        req.end();
    });
}

function createDatasource() {
    console.log('2. Creating datasource with correct schema...');

    // Schema strictly defined
    const postData = querystring.stringify({
        name: 'qr_scans',
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
            console.log('   Response:', body);

            if (res.statusCode === 200) {
                console.log('✅ Datasource created successfully.');
                setTimeout(testIngest, 2000); // Wait a bit for propagation
            } else {
                console.log('❌ Failed to create datasource.');
            }
        });
    });

    req.write(postData);
    req.end();
}

function testIngest() {
    console.log('3. Testing Ingestion...');
    const data = JSON.stringify({
        shortId: 'RECREATE_TEST',
        country: 'US',
        ua: 'Script',
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
            console.log(`   Ingest Status: ${res.statusCode}`);
            if (res.statusCode === 200 || res.statusCode === 202) {
                console.log('🎉 SUCCESS: Data pipeline is fully operational.');
            } else {
                console.log('   Response:', body);
                console.log('❌ FAILURE: Ingest still failing.');
            }
        });
    });
    req.write(data);
    req.end();
}

// Run flow
deleteDatasource().then(createDatasource);

const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables manually
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const ACCOUNT_ID = envConfig.CF_ACCOUNT_ID;
const NAMESPACE_ID = envConfig.CF_NAMESPACE_ID;
const TOKEN = envConfig.CF_API_TOKEN;

if (!ACCOUNT_ID || !NAMESPACE_ID || !TOKEN) {
    console.error("Missing credentials in .env.local");
    process.exit(1);
}

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`;

async function testCloudflare() {
    console.log("Testing Cloudflare KV Connection...");

    // 0. Verify Token
    console.log("Verifying Token...");
    try {
        const verifyRes = await fetch("https://api.cloudflare.com/client/v4/user/tokens/verify", {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const verifyJson = await verifyRes.json();
        console.log("Token Verification:", verifyJson);

        if (!verifyJson.success) {
            console.error("CRITICAL: Token is invalid or expired.");
            return;
        }
    } catch (e) {
        console.error("Token verification network error", e);
    }

    console.log(`Account: ${ACCOUNT_ID}`);
    console.log(`Namespace: ${NAMESPACE_ID}`);

    // 1. Try to Perform a WRITE
    const testKey = "debug_test_key";
    const testValue = "Connected successfully at " + new Date().toISOString();

    console.log(`\nAttempting to write key: ${testKey}...`);

    try {
        const res = await fetch(`${BASE_URL}/values/${testKey}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
            },
            body: testValue
        });

        if (!res.ok) {
            console.error(`WRITE FAILED: ${res.status} ${res.statusText}`);
            console.error(await res.text());
            return;
        }
        console.log("Details:", await res.json()); // KV API usually returns JSON success wrapper
        console.log("WRITE SUCCESS!");

        // 2. Try to READ it back
        console.log(`\nAttempting to read key: ${testKey}...`);
        const readRes = await fetch(`${BASE_URL}/values/${testKey}`, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
            }
        });

        if (!readRes.ok) {
            console.error(`READ FAILED: ${readRes.status} ${readRes.statusText}`);
            console.error(await readRes.text());
            return;
        }

        const value = await readRes.text();
        console.log(`READ SUCCESS! Value: "${value}"`);

    } catch (e) {
        console.error("Network/Script Error:", e);
    }
}

testCloudflare();

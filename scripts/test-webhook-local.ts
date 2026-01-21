
import fetch from 'node-fetch';

async function testWebhook() {
    const baseUrl = 'https://thorough-suspended-mobility-turbo.trycloudflare.com';
    const path = 'webhook/classify-comment';
    const verifyToken = 'toxiguard-verification-v1';
    const challenge = '1234567890';

    const url = `${baseUrl}/${path}?hub.mode=subscribe&hub.verify_token=${verifyToken}&hub.challenge=${challenge}`;

    console.log(`Testing URL: ${url}`);

    try {
        const response = await fetch(url);
        const text = await response.text();

        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text}`);

        if (response.status === 200 && text === challenge) {
            console.log('✅ SUCCESS: Local n8n verification works!');
        } else {
            console.log('❌ FAILURE: Local n8n returned unexpected response.');
        }
    } catch (error) {
        console.error('❌ FAILURE: Could not connect to n8n.', error);
    }
}

testWebhook();

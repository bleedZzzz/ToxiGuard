
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const appSecret = process.env.META_APP_SECRET;
const appId = process.env.META_APP_ID;

async function inspectToken() {
    console.log('Inspecting Token...');

    // We need an App Access Token to use /debug_token
    // Format: app_id|app_secret
    const appToken = `${appId}|${appSecret}`;

    try {
        const res = await fetch(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${appToken}`);
        const data = await res.json() as any;

        if (data.error) {
            console.error('❌ Debug Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('🔍 Token Info:', JSON.stringify(data.data, null, 2));
        }
    } catch (err: any) {
        console.error('❌ Fetch Error:', err.message);
    }
}

inspectToken();

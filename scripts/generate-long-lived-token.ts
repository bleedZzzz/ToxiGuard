
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const appId = process.env.META_APP_ID;
const appSecret = process.env.META_APP_SECRET;
const shortToken = process.env.META_USER_ACCESS_TOKEN;
const pageId = '976828372182708'; // Your ToxiGuard Test Page ID

async function generatePermanentToken() {
    console.log('🚀 Starting Token Exchange Process...');

    if (!appId || !appSecret || !shortToken) {
        console.error('❌ Missing required environment variables in .env (META_APP_ID, META_APP_SECRET, or META_USER_ACCESS_TOKEN)');
        return;
    }

    try {
        // 1. Exchange short-lived token for long-lived one (60 days)
        console.log('📡 Step 1/2: Exchanging for a 60-day Long-Lived Token...');
        const extendUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
        const extendRes = await fetch(extendUrl);
        const extendData = await extendRes.json() as any;

        if (extendData.error) {
            console.error('❌ Failed to extend token:', extendData.error.message);
            return;
        }

        const longLivedToken = extendData.access_token;
        console.log('✅ Success! 60-day token generated.');

        // 2. Refresh the Page Token using the long-lived user token
        console.log('📡 Step 2/2: Converting to a Permanent Page Token...');
        const pageUrl = `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${longLivedToken}`;
        const pageRes = await fetch(pageUrl);
        const pageData = await pageRes.json() as any;

        if (pageData.error) {
            console.error('❌ Failed to get Page token:', pageData.error.message);
            return;
        }

        const permanentPageToken = pageData.access_token;
        console.log('\n🌟 CONGRATULATIONS! Permanent Page Token generated successfully.');
        const fs = await import('fs');
        fs.writeFileSync('permanent_token.txt', permanentPageToken);
        console.log('----------------------------------------------------');
        console.log(permanentPageToken);
        console.log('----------------------------------------------------');
        console.log('\n👉 ACTION REQUIRED:');
        console.log('1. Copy the token above.');
        console.log('2. Replace META_USER_ACCESS_TOKEN in your .env with this new token.');
        console.log('3. Run "npx ts-node scripts/refresh-and-ingest.ts" to finish!');

    } catch (err: any) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

generatePermanentToken();


import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const appId = process.env.META_APP_ID;
const appSecret = process.env.META_APP_SECRET;
const shortToken = process.env.META_USER_ACCESS_TOKEN;
const pageId = process.env.META_PAGE_ID || '1614940733203422';

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
        console.log('📡 Step 2/2: Fetching Page Tokens from /me/accounts...');
        const accountsUrl = `https://graph.facebook.com/v19.0/me/accounts?access_token=${longLivedToken}`;
        const accountsRes = await fetch(accountsUrl);
        const accountsData = await accountsRes.json() as any;

        if (accountsData.error) {
            console.error('❌ Failed to get accounts:', accountsData.error.message);
            return;
        }

        const page = accountsData.data?.find((p: any) => p.id === pageId);

        if (!page) {
            console.error(`❌ Could not find Page with ID ${pageId} in your account.`);
            console.log('Available Pages:', accountsData.data?.map((p: any) => `${p.name} (${p.id})`).join(', '));
            return;
        }

        const permanentPageToken = page.access_token;
        console.log('\n🌟 CONGRATULATIONS! Permanent Page Token generated successfully.');
        const fs = await import('fs');
        fs.writeFileSync('permanent_token.txt', permanentPageToken);
        console.log('----------------------------------------------------');
        console.log(permanentPageToken);
        console.log('----------------------------------------------------');
        console.log('\n👉 ACTION REQUIRED:');
        console.log('1. Copy the token above.');
        console.log('5. Copy the token and paste it into your .env as META_USER_ACCESS_TOKEN');
        console.log('6. Run: npx ts-node scripts/generate-long-lived-token.ts (This makes it PERMANENT)');
        console.log('\nFinal Step: npx ts-node scripts/refresh-and-ingest.ts');

    } catch (err: any) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

generatePermanentToken();

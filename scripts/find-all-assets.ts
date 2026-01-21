
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;

async function findAll() {
    console.log('--- Finding All Accessible Meta Assets ---');
    console.log('User Token:', token?.substring(0, 15) + '...');

    // 1. Pages
    console.log('\nChecking /me/accounts...');
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${token}`);
    const pagesData = await pagesRes.json() as any;
    console.log('Pages Result:', JSON.stringify(pagesData, null, 2));

    // 2. Business Accounts
    console.log('\nChecking /me/businesses...');
    const bizRes = await fetch(`https://graph.facebook.com/v19.0/me/businesses?access_token=${token}`);
    const bizData = await bizRes.json() as any;
    console.log('Businesses Result:', JSON.stringify(bizData, null, 2));

    // 3. User Info
    console.log('\nChecking /me...');
    const meRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${token}`);
    const meData = await meRes.json() as any;
    console.log('Me Result:', JSON.stringify(meData, null, 2));

    // 4. IG Accounts (if any)
    console.log('\nChecking /me?fields=instagram_business_accounts...');
    const igRes = await fetch(`https://graph.facebook.com/v19.0/me?fields=instagram_business_accounts&access_token=${token}`);
    const igData = await igRes.json() as any;
    console.log('IG Result:', JSON.stringify(igData, null, 2));
}

findAll();

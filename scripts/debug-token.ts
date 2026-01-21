
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;

async function debugToken() {
    console.log('Testing token:', token?.substring(0, 10) + '...');

    try {
        const res = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${token}&fields=id,name`);
        const data = await res.json() as any;

        if (data.error) {
            console.error('❌ Token Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('✅ Token Valid! User:', data.name, '(' + data.id + ')');

            // Check permissions
            const permRes = await fetch(`https://graph.facebook.com/v19.0/me/permissions?access_token=${token}`);
            const permData = await permRes.json() as any;
            console.log('📋 Permissions:', JSON.stringify(permData.data?.filter((p: any) => p.status === 'granted').map((p: any) => p.permission)));
        }
    } catch (err: any) {
        console.error('❌ Fetch Error:', err.message);
    }
}

debugToken();

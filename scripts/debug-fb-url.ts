
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const urlToDebug = 'https://www.facebook.com/share/p/1XtqRzDHFe/';

async function debugUrl() {
    console.log(`🔍 Debugging URL: ${urlToDebug}`);

    try {
        const url = `https://graph.facebook.com/v19.0/?id=${encodeURIComponent(urlToDebug)}&access_token=${token}`;
        console.log(`Requesting: ${url.replace(token!, 'TOKEN_HIDDEN')}`);

        const res = await fetch(url);
        const data = await res.json() as any;

        if (data.error) {
            console.error('❌ Meta API Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('✅ Success!');
            console.log(JSON.stringify(data, null, 2));

            if (data.og_object) {
                console.log(`\nFound Object ID: ${data.og_object.id}`);
                console.log(`Type: ${data.type}`);
            }
        }
    } catch (err: any) {
        console.error('❌ Fetch Error:', err.message);
    }
}

debugUrl();


import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const pageId = '976828372182708';

async function deepScan() {
    console.log(`🚀 Deep Scanning Page: ${pageId}`);

    // 1. Check basic page info
    const pageInfo = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}?fields=name,username,link&access_token=${token}`)).json() as any;
    console.log(`Page: ${pageInfo.name} (${pageInfo.link})\n`);

    // 2. Scan Feed
    console.log('--- SCANNING FEED ---');
    const feed = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed?fields=id,message,story,created_time,status_type&limit=50&access_token=${token}`)).json() as any;

    if (feed.data) {
        feed.data.forEach((p: any) => {
            console.log(`[${p.created_time}] ID: ${p.id}`);
            console.log(`   Type: ${p.status_type}`);
            console.log(`   Content: ${p.message || p.story || '(No Text Content)'}`);
        });
    } else if (feed.error) {
        console.error('Feed Error:', feed.error.message);
    }

    // 3. Scan Photos (where Gorilla might be)
    console.log('\n--- SCANNING PHOTOS (Uploaded) ---');
    const photos = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos?type=uploaded&fields=id,name,link&access_token=${token}`)).json() as any;
    if (photos.data) {
        photos.data.forEach((p: any) => {
            console.log(`Photo ID: ${p.id}`);
            console.log(`   Caption: ${p.name || '(No Caption)'}`);
            console.log(`   Link: ${p.link}`);
        });
    }
}

deepScan();

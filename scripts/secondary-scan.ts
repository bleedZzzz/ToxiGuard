
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const pageId = '976828372182708';

async function secondaryScan() {
    console.log(`🚀 Secondary Scanning Page: ${pageId}`);

    // 1. Scan Videos
    console.log('--- SCANNING VIDEOS ---');
    const videos = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}/videos?fields=id,title,description,created_time&access_token=${token}`)).json() as any;
    if (videos.data) {
        videos.data.forEach((v: any) => {
            console.log(`Video ID: ${v.id}`);
            console.log(`   Title: ${v.title || v.description || '(No Title)'}`);
            console.log(`   Time: ${v.created_time}`);
        });
    }

    // 2. Scan Reels (via media edge if available for pages, otherwise feed is usually enough)
}

secondaryScan();

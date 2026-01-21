
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const pageId = '976828372182708';

async function scanMentions() {
    console.log(`🚀 Scanning Mentions/Tags for Page: ${pageId}`);

    // 1. Tagged Posts
    console.log('--- TAGGED POSTS ---');
    const tagged = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}/tagged?fields=id,message,from,created_time&access_token=${token}`)).json() as any;
    console.log(JSON.stringify(tagged, null, 2));

    // 2. Mentions (Page Mentions)
    console.log('\n--- PAGE MENTIONS ---');
    const mentions = await (await fetch(`https://graph.facebook.com/v19.0/${pageId}/mentions?access_token=${token}`)).json() as any;
    console.log(JSON.stringify(mentions, null, 2));
}

scanMentions();

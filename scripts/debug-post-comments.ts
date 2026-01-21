
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const token = process.env.META_USER_ACCESS_TOKEN;
const postId = '976828372182708_122099207301229451';

async function checkComments() {
    console.log(`Checking comments for post: ${postId}`);

    try {
        const url = `https://graph.facebook.com/v19.0/${postId}/comments?access_token=${token}&fields=id,message,from,created_time`;
        console.log(`URL: ${url.replace(token!, 'TOKEN_HIDDEN')}`);

        const res = await fetch(url);
        const data = await res.json() as any;

        if (data.error) {
            console.error('❌ Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('✅ Success!');
            console.log('Comments Found:', data.data?.length || 0);
            console.log(JSON.stringify(data.data, null, 2));
        }
    } catch (err: any) {
        console.error('❌ Fetch Error:', err.message);
    }
}

checkComments();

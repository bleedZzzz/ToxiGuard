
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const appId = process.env.META_APP_ID;
const pageId = process.env.META_PAGE_ID || '1614940733203422';

console.log('🔗 Meta Token Helper');
console.log('-------------------');
console.log(`To fix Facebook ingestion, you need a fresh User Access Token with 'pages_read_engagement' and 'pages_manage_metadata' permissions.`);
console.log('\n1. Open Graph API Explorer: https://developers.facebook.com/tools/explorer/');
console.log(`2. Select App: [${appId}]`);
console.log('3. Add Permissions: pages_read_engagement, pages_manage_metadata, pages_show_list, public_profile, instagram_basic');
console.log('4. Click "Generate Token"');
console.log('5. Copy the token and paste it into your .env as META_USER_ACCESS_TOKEN');
console.log('\nAfter updating .env, run: npx ts-node scripts/refresh-and-ingest.ts');

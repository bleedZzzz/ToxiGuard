
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function updateAccount() {
    const { error } = await supabase.from('social_accounts').upsert({
        page_id: process.env.META_PAGE_ID!,
        page_name: 'ToxiGuard Test Page',
        access_token: process.env.META_USER_ACCESS_TOKEN,
        platform: 'facebook',
        user_id: 'da554f2f-6c3f-49b7-83b5-b2aa1763464b'
    }, { onConflict: 'page_id' });

    if (error) console.error('❌ Error:', error.message);
    else console.log('✅ social_accounts updated with Page ID:', process.env.META_PAGE_ID);
}

updateAccount();

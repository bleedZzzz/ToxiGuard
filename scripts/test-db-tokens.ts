
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testExistingTokens() {
    console.log('Testing existing tokens from DB...');
    const { data: accounts } = await supabase.from('social_accounts').select('*');

    for (const account of accounts || []) {
        console.log(`\n📄 Account: ${account.page_name} (${account.page_id})`);
        console.log(`Token: ${account.access_token.substring(0, 15)}...`);

        try {
            const res = await fetch(`https://graph.facebook.com/v19.0/${account.page_id}?fields=id,name&access_token=${account.access_token}`);
            const data = await res.json() as any;

            if (data.error) {
                console.error(`❌ Token Invalid: ${data.error.message}`);
            } else {
                console.log(`✅ Token Valid! Name: ${data.name}`);
            }
        } catch (err: any) {
            console.error(`❌ Fetch Error: ${err.message}`);
        }
    }
}

testExistingTokens();

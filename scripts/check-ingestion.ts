
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking database for comments...');
    const { count, error } = await supabase.from('comments').select('*', { count: 'exact', head: true });
    if (error) {
        console.error('Error querying DB:', error.message);
        return;
    }
    console.log(`\n📊 Total Comments in DB: ${count}`);

    if (count && count > 0) {
        const { data } = await supabase.from('comments').select('content, created_at').order('created_at', { ascending: false }).limit(1);
        if (data && data.length > 0) {
            console.log('📝 Latest comment:', JSON.stringify(data[0], null, 2));
        }
    } else {
        console.log('❌ No comments found yet.');
    }
}

check();

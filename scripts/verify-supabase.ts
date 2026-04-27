import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verify() {
    console.log('Testing Supabase with Service Role...');
    const { data, error } = await supabase.from('posts').upsert({
        id: 'verify_test_post',
        user_id: 'da554f2f-6c3f-49b7-83b5-b2aa1763464b',
        content: 'Verification Test'
    }, { onConflict: 'id' }).select();

    if (error) {
        console.error('❌ Supabase Error:', error.message);
    } else {
        console.log('✅ Supabase Success! Post created/updated:', data);
    }
}

verify();

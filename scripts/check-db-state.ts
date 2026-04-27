import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
    const { data, error } = await supabase.from('social_accounts').select('*');
    if (error) console.error('Error:', error);
    else console.log('Social Accounts:', JSON.stringify(data, null, 2));

    const { count: commentCount } = await supabase.from('comments').select('*', { count: 'exact', head: true });
    console.log('Total Comments in DB:', commentCount);

    const { count: postCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
    console.log('Total Posts in DB:', postCount);
}

check();

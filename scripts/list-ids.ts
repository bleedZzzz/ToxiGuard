import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function list() {
    const { data: posts } = await supabase.from('posts').select('id, content');
    console.log('Posts in DB:', posts);

    const { data: comments } = await supabase.from('comments').select('id, post_id, content');
    console.log('Comments in DB:', comments);
}

list();

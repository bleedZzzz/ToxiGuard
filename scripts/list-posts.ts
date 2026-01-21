import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUtc = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function listPosts() {
    console.log('🔍 Fetching posts from Supabase...');
    const { data: posts, error } = await supabaseUtc
        .from('toxicity_scores')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('❌ Error fetching posts:', error);
        return;
    }

    if (!posts || posts.length === 0) {
        console.log('⚠️ No posts found in the database.');
        console.log('   You may need to ingest some posts first or manually insert one.');
    } else {
        console.log('✅ Found Posts:');
        console.log(JSON.stringify(posts, null, 2));
    }
}

listPosts();

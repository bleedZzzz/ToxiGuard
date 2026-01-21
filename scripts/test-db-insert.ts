
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing Manual Insert...');

    // 1. Get a user ID
    const { data: accounts } = await supabase.from('social_accounts').select('user_id').limit(1);
    if (!accounts || accounts.length === 0) {
        console.error('No accounts found to retrieve user_id');
        return;
    }
    const userId = accounts[0].user_id;
    console.log('Using User ID:', userId);

    // 2. Insert Post
    const postId = 'manual_test_post_1';
    const { error: postError } = await supabase.from('posts').upsert({
        id: postId,
        user_id: userId,
        content: 'Manual Test Post'
    });

    if (postError) {
        console.error('❌ Post Insert Failed:', postError);
        return;
    }
    console.log('✅ Post Inserted');

    // 3. Insert Comment
    const commentId = 'manual_test_comment_1';
    const { error: commentError } = await supabase.from('comments').upsert({
        id: commentId,
        post_id: postId,
        user_id: userId,
        content: 'Manual Test Comment',
        commenter_name: 'Tester'
    });

    if (commentError) {
        console.error('❌ Comment Insert Failed:', commentError);
    } else {
        console.log('✅ Comment Inserted');
    }
}

testInsert();

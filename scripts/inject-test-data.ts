import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inject() {
    const userId = 'da554f2f-6c3f-49b7-83b5-b2aa1763464b';

    console.log('Inserting Post...');
    await supabase.from('posts').upsert({
        id: 'post_1',
        user_id: userId,
        content: 'Manually Injected Post'
    });

    console.log('Inserting Comment...');
    await supabase.from('comments').upsert({
        id: 'comm_1',
        post_id: 'post_1',
        user_id: userId,
        content: 'This comment is toxic!',
        commenter_name: 'Angry User'
    });

    console.log('Inserting Toxicity Score...');
    await supabase.from('toxicity_scores').upsert({
        comment_id: 'comm_1',
        label: 'harassment',
        score: 0.88,
        model: 'manual'
    });

    console.log('✨ Data injected. Check dashboard.');
}

inject();

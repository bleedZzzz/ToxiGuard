
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkComments() {
    console.log('Fetching all comments...');

    const { data: comments, error: cError } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (cError) {
        console.error('❌ Error fetching comments:', cError.message);
        return;
    }

    console.log(`Found ${comments.length} comments total.\n`);

    for (const c of comments) {
        const { data: scores } = await supabase
            .from('toxicity_scores')
            .select('*')
            .eq('comment_id', c.id);

        const score = scores && scores[0] ? `${scores[0].label}: ${scores[0].score}` : 'No score';
        console.log(`[${c.created_at}] "${c.content}" -> ${score}`);
    }
}

checkComments();

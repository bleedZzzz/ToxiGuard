import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env');
    console.log('Current working directory:', process.cwd());
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function purgeData() {
    console.log('🚀 Starting data purge...');

    // Order of deletion to respect foreign keys:
    // 1. toxicity_scores (depends on comments)
    // 2. reports (depends on comments)
    // 3. comments (depends on posts)
    // 4. posts (depends on profiles)
    // 5. social_accounts (depends on profiles)

    const tables = [
        'toxicity_scores',
        'reports',
        'comments',
        'posts',
        'social_accounts'
    ];

    for (const table of tables) {
        console.log(`🧹 Purging table: ${table}...`);
        const { error, count } = await supabase
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (error) {
            // If it's a text ID (like in posts/comments), we might need a different approach if neq fails
            // but neq on id should work for all if we allow all matches.
            // Actually, .delete().match({}) might be safer or just a filter that always matches.
            const { error: error2 } = await supabase
                .from(table)
                .delete()
                .filter('id', 'neq', 'non-existent-id-xyz');

            if (error2) {
                console.error(`❌ Error purging ${table}:`, error2.message);
            } else {
                console.log(`✅ Table ${table} purged.`);
            }
        } else {
            console.log(`✅ Table ${table} purged.`);
        }
    }

    console.log('\n✨ Database cleanup complete. Dashboard should now be empty.');
}

purgeData().catch(console.error);


import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count, error } = await supabase.from('comments').select('*', { count: 'exact', head: true });

    let output = '';
    if (error) output += `Error: ${error.message}\n`;
    output += `Total Comments: ${count}\n`;

    if (count && count > 0) {
        const { data } = await supabase.from('comments').select('content');
        output += `Comments: ${JSON.stringify(data?.map(c => c.content))}\n`;
    } else {
        output += 'No comments found.\n';
    }

    fs.writeFileSync('db_check_result.txt', output);
    console.log('Result written to db_check_result.txt');
}

check();

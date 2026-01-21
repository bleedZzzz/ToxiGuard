
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function resetPassword() {
    console.log('🔄 Resetting password for rupaksardar65@gmail.com...');
    const { data, error } = await supabase.auth.admin.updateUserById(
        'da554f2f-6c3f-49b7-83b5-b2aa1763464b',
        { password: 'Password123!' }
    );

    if (error) {
        console.error('❌ Failed to reset password:', error);
    } else {
        console.log('✅ Password reset successful!');
        console.log('   Email: rupaksardar65@gmail.com');
        console.log('   New Password: Password123!');
    }
}

resetPassword();


import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createNewUser() {
    console.log('🔄 Creating new user test@toxi.com...');
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'test@toxi.com',
        password: 'Password123!',
        email_confirm: true
    });

    if (error) {
        console.error('❌ Failed to create user:', error);
    } else {
        console.log('✅ User created successfully!');
        console.log('   Email: test@toxi.com');
        console.log('   Password: Password123!');
        console.log('   ID:', data.user.id);
    }
}

createNewUser();

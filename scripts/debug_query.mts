
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function debug() {
    console.log('🐞 Debugging Dashboard Query...')

    const { data, error } = await supabase
        .from('comments')
        .select(`
      *,
      posts (
        content
      ),
      toxicity_scores (
        score,
        label
      )
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('❌ Query Failed:', error)
    } else {
        console.log(`✅ Query Success. Found ${data.length} rows.`)
        console.log('Sample Data:', JSON.stringify(data[0], null, 2))
    }
}

debug()

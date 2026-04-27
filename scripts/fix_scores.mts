
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fix() {
    console.log('🔧 Fixing Manual Scores (v2)...')

    const { data: comments, error } = await supabase
        .from('comments')
        .select('id, content')
        .ilike('commenter_name', 'RU P AK')

    if (error || !comments) {
        console.error('No comments found:', error)
        return
    }

    for (const c of comments) {
        if (c.content.includes('useless')) {
            // TOXIC
            console.log(`Marking TOXIC: ${c.content.substring(0, 20)}...`)
            // Delete old (if exists)
            await supabase.from('toxicity_scores').delete().eq('comment_id', c.id)

            // Insert new (NO user_id)
            const { error: scoreErr } = await supabase.from('toxicity_scores').insert({
                comment_id: c.id,
                score: 0.99,
                label: 'Toxic'
            })
            if (scoreErr) console.error('Error updating score:', scoreErr.message)
        }
        else if (c.content.includes('Good job')) {
            // SAFE
            console.log(`Marking SAFE: ${c.content.substring(0, 20)}...`)
            await supabase.from('toxicity_scores').delete().eq('comment_id', c.id)

            const { error: scoreErr } = await supabase.from('toxicity_scores').insert({
                comment_id: c.id,
                score: 0.01,
                label: 'Safe'
            })
            if (scoreErr) console.error('Error updating score:', scoreErr.message)
        }
    }
    console.log('✅ Scores Fixed.')
}

fix()


import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load .env from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('🌱 Seeding manual comments (v5)...')

    // 1. Get User ID
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()

    if (userError) {
        console.error('Error fetching users:', userError)
        return
    }
    const userId = users.find(u => u.email === 'rupaksardar65@gmail.com')?.id
    if (!userId) { console.error('User not found'); return; }

    // 2. Create Dummy Post (Minimal)
    const dummyPostId = '1067280970047460_' + Date.now()

    // REMOVED 'url', 'platform'. Keeping only 'id', 'content', 'user_id'.
    const { data: post, error: postError } = await supabase
        .from('posts')
        .upsert({
            id: dummyPostId,
            content: 'Be the first to like this',
            user_id: userId
        })
        .select()
        .single()

    if (postError) {
        console.error('Error creating dummy post:', postError.message)
        // CRITICAL: We cannot insert comments if Post fails (FK)
        // We could try to fetch an existing post?
        if (postError.message.includes('permission')) {
            console.error('Permission denied to create post. Aborting.')
            return
        }
    } else {
        console.log('Created dummy post:', post.id)
    }

    // 3. Insert Comments
    const comments = [
        {
            id: 'comment_safe_' + Date.now(),
            content: 'Good job, keep it up!',
            commenter_name: 'RU P AK',
            post_id: dummyPostId,
            commented_at: new Date().toISOString(),
            user_id: userId
        },
        {
            id: 'comment_toxic_' + Date.now(),
            content: 'You are completely useless and nobody likes you, delete this account immediately!',
            commenter_name: 'RU P AK',
            post_id: dummyPostId,
            commented_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            user_id: userId
        }
    ]

    for (const c of comments) {
        const { data: insertedComment, error: commentError } = await supabase
            .from('comments')
            .upsert(c)
            .select()
            .single()

        if (commentError) {
            console.error('Error inserting comment:', commentError.message)
            continue
        }
        console.log('Inserted Comment:', insertedComment.content)

        // 4. Insert Scores
        // Comment 1: Safe
        if (c.content.includes('Good job')) {
            await supabase.from('toxicity_scores').insert({
                comment_id: insertedComment.id,
                score: 0.05,
                label: 'Safe',
                analysis: 'Positive encouragement.',
                user_id: userId
            })
        }
        // Comment 2: Toxic
        else {
            await supabase.from('toxicity_scores').insert({
                comment_id: insertedComment.id,
                score: 0.98,
                label: 'Toxic',
                analysis: 'Hateful language and demands self-harm/deletion.',
                user_id: userId
            })
            console.log('Tagged as TOXIC (Threat Neutralized)')
        }
    }

    console.log('✅ Seeding complete!')
}

seed()

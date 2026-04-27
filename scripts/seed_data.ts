
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'

dotenv.config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('Starting seed...')

    const userId = 'da554f2f-6c3f-49b7-83b5-b2aa1763464b' // Using a fixed UUID usually found in the project or generate new
    const pageId = '100569069502742' // Mock page ID

    // 1. Create a Post
    const postId = '17841405797098421' // Mock numerical ID like FB
    const { error: postError } = await supabase
        .from('posts')
        .upsert({
            id: postId,
            user_id: userId,
            content: 'So excited to announce our new product launch! 🚀 #LaunchDay',
            created_at: new Date().toISOString()
        })

    if (postError) console.error('Post Error:', postError)

    // 2. Create Comments and Scores
    const comments = [
        { content: "This is amazing! Congrats!", label: "safe", score: 0.02, name: "Sarah Jenkins" },
        { content: "You guys are total garbage. Quit now.", label: "hate_speech", score: 0.98, name: "Troll_01" },
        { content: "Nobody cares about this trash.", label: "harassment", score: 0.85, name: "Hater123" },
        { content: "Can I buy this in the UK?", label: "safe", score: 0.05, name: "Mike Ross" },
        { content: "Kill yourself.", label: "violence", score: 0.99, name: "AnonUser" },
        { content: "Click here to win a free iPhone!", label: "spam", score: 0.92, name: "Bot_99" },
    ]

    for (const c of comments) {
        const commentId = uuidv4()

        // Insert Comment
        await supabase.from('comments').upsert({
            id: commentId,
            post_id: postId,
            user_id: userId,
            content: c.content,
            commenter_name: c.name,
            created_at: new Date(Date.now() - Math.random() * 10000000).toISOString() // Random time in past
        })

        // Insert Score
        await supabase.from('toxicity_scores').upsert({
            comment_id: commentId,
            score: c.score,
            label: c.label,
            model: 'groq/llama-3.3-70b'
        })
    }

    // 3. Create a Social Account entry to make the dashboard "active"
    await supabase.from('social_accounts').upsert({
        user_id: userId,
        platform: 'facebook',
        page_name: 'Tech Innovators',
        page_id: pageId,
        access_token: 'mock_token'
    })

    console.log('Seed completed!')
}

seed()

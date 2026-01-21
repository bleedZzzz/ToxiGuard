
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Init Supabase with Service Role for bypassing RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VERIFY_TOKEN = 'toxiguard-verification-v1';

// 1. GET: Webhook Verification
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('🔍 Webhook Verification Attempt:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook Verified Successfully');
        // Must return ONLY the challenge string as plain text
        return new Response(challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
        });
    }

    console.error('❌ Webhook Verification Failed: Invalid mode or token');
    return new Response('Forbidden', { status: 403 });
}

// 2. POST: Event Handling
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('📨 Webhook Body:', JSON.stringify(body, null, 2));

        if (body.object === 'page') {
            for (const entry of body.entry || []) {
                console.log('➡️ Processing Entry:', entry.id);
                for (const change of entry.changes || []) {
                    const value = change.value;
                    console.log('➡️ Processing Change:', value.item, value.verb);

                    if (value.item === 'comment' && value.verb === 'add') {
                        await handleNewComment(value, entry.id);
                    } else {
                        console.log('⚠️ Ignoring change (not a new comment):', value.item, value.verb);
                    }
                }
            }
            return NextResponse.json({ success: true }, { status: 200 });
        }

        console.log('⚠️ Webhook not a page object:', body.object);
        return NextResponse.json({ message: 'Not a page event' }, { status: 200 });
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function handleNewComment(data: any, pageId: string) {
    const { from, message, post_id, comment_id } = data;
    const commenterId = from.id;
    const commenterName = from.name;

    console.log(`Processing comment from ${commenterName}: ${message}`);

    // 1. Get User ID from Page ID
    const { data: accounts } = await supabase
        .from('social_accounts')
        .select('user_id')
        .eq('page_id', pageId)
        .single();

    if (!accounts) {
        console.error(`❌ Page ID ${pageId} not linked to any user.`);
        return;
    }
    const userId = accounts.user_id;

    // 2. Upsert Post (Placeholder)
    await supabase.from('posts').upsert({
        id: post_id,
        user_id: userId,
        content: 'Facebook Post (Placeholder)'
    });

    // 3. Upsert Comment
    const { error: commentError } = await supabase.from('comments').upsert({
        id: comment_id,
        post_id: post_id,
        user_id: userId,
        content: message,
        commenter_name: commenterName,
        commented_at: new Date().toISOString() // Approximate
    });

    if (commentError) {
        console.error('❌ Failed to save comment:', commentError);
        return;
    }

    // 4. AI Classification
    await classifyComment(comment_id, message, userId);
}

async function classifyComment(commentId: string, text: string, userId: string) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { "role": "system", "content": "You are a content moderation AI. Return ONLY a JSON object: { 'label': 'safe' | 'hate_speech' | 'harassment' | 'sexual' | 'violence' | 'spam', 'score': 0.0-1.0 }. Score 0.0 is safe, 1.0 is severe." },
                    { "role": "user", "content": text }
                ],
                response_format: { type: "json_object" }
            })
        });

        const aiData = await response.json();
        const content = JSON.parse(aiData.choices[0].message.content);

        // 5. Save Score
        await supabase.from('toxicity_scores').insert({
            comment_id: commentId,
            score: content.score,
            label: content.label,
            model: 'openai/gpt-3.5-turbo'
        });

        // 6. Create Report if toxic
        if (content.score >= 0.7) {
            await supabase.from('reports').insert({
                comment_id: commentId,
                user_id: userId,
                reason: `AI Flagged: ${content.label} (${content.score})`,
                status: 'pending'
            });
        }

        console.log('✅ Comment Classified & Saved:', content);

    } catch (error) {
        console.error('❌ AI Classification Failed:', error);
    }
}

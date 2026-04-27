
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Init Supabase with Service Role for bypassing RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'toxiguard-verification-v1';

// 1. GET: Webhook Verification
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('🔍 Webhook Verification Attempt:', { mode, token, challenge });

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook Verified Successfully');
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
            const results = [];

            for (const entry of body.entry || []) {
                console.log('➡️ Processing Entry:', entry.id);
                for (const change of entry.changes || []) {
                    const value = change.value;
                    console.log('➡️ Processing Change:', value.item, value.verb);

                    if (value.item === 'comment' && value.verb === 'add') {
                        try {
                            const result = await handleNewComment(value, entry.id);
                            results.push({ comment_id: value.comment_id, status: 'processed', ...result });
                        } catch (error: any) {
                            console.error('❌ Error processing comment:', value.comment_id, error.message);
                            results.push({ comment_id: value.comment_id, status: 'error', error: error.message });
                        }
                    } else {
                        console.log('⚠️ Ignoring change (not a new comment):', value.item, value.verb);
                    }
                }
            }

            return NextResponse.json({ success: true, processed: results.length, results }, { status: 200 });
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
    const commenterName = from.name;

    console.log(`Processing comment from ${commenterName}: ${message}`);

    // 1. Get User ID from Page ID
    const { data: accounts } = await supabase
        .from('social_accounts')
        .select('user_id')
        .eq('page_id', pageId)
        .single();

    if (!accounts) {
        throw new Error(`Page ID ${pageId} not linked to any user.`);
    }
    const userId = accounts.user_id;

    // 2. Upsert Post
    const { error: postError } = await supabase.from('posts').upsert({
        id: post_id,
        user_id: userId,
        content: `Facebook Post`,
    });

    if (postError) {
        console.error('⚠️ Post upsert warning:', postError.message);
    }

    // 3. Upsert Comment
    const { error: commentError } = await supabase.from('comments').upsert({
        id: comment_id,
        post_id: post_id,
        user_id: userId,
        content: message,
        commenter_name: commenterName,
        commented_at: new Date().toISOString()
    });

    if (commentError) {
        throw new Error(`Failed to save comment: ${commentError.message}`);
    }

    // 4. AI Classification
    const classification = await classifyComment(comment_id, message, userId);
    return classification;
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
                    {
                        role: 'system',
                        content: `You are a content moderation AI. Analyze the following comment and return ONLY a JSON object with exactly these fields:
- "label": one of "safe", "hate_speech", "harassment", "sexual", "violence", "spam"
- "score": a float from 0.0 (completely safe) to 1.0 (severely toxic)
Return ONLY valid JSON, no other text.`
                    },
                    { role: 'user', content: text }
                ],
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
        }

        const aiData = await response.json();
        const content = JSON.parse(aiData.choices[0].message.content);

        // 5. Save Score
        const { error: scoreError } = await supabase.from('toxicity_scores').insert({
            comment_id: commentId,
            score: content.score,
            label: content.label,
            model: 'openai/gpt-3.5-turbo'
        });

        if (scoreError) {
            console.error('⚠️ Score insert warning:', scoreError.message);
        }

        // 6. Fetch threshold from profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('threshold')
            .eq('id', userId)
            .single();

        const threshold = profile?.threshold ?? 0.7;

        // 7. Create Report if toxic based on custom threshold
        if (content.score >= threshold) {
            const { error: reportError } = await supabase.from('reports').insert({
                comment_id: commentId,
                user_id: userId,
                reason: `AI Flagged: ${content.label} (${(content.score * 100).toFixed(0)}%)`,
                status: 'pending'
            });

            if (reportError) {
                console.error('⚠️ Report insert warning:', reportError.message);
            }
        }

        console.log('✅ Comment Classified & Saved:', content);
        return { label: content.label, score: content.score, flagged: content.score >= threshold };

    } catch (error: any) {
        console.error('❌ AI Classification Failed:', error.message);
        return { label: 'error', score: 0, flagged: false, error: error.message };
    }
}

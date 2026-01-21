
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const n8nWebhookUrl = process.env.N8N_BASE_URL ? `${process.env.N8N_BASE_URL.replace(/\/$/, '')}/webhook/classify-comment` : 'http://localhost:5678/webhook/classify-comment';

const supabase = createClient(supabaseUrl, supabaseKey);

async function ingest() {
    console.log('🚀 Starting Manual Ingestion...');
    console.log(`🔗 Target n8n Webhook: ${n8nWebhookUrl}`);

    // 1. Get Connected Social Accounts
    const { data: accounts, error: accountError } = await supabase.from('social_accounts').select('*');

    if (accountError || !accounts || accounts.length === 0) {
        console.error('❌ No social accounts found in database.');
        return;
    }

    for (const account of accounts) {
        console.log(`\n📂 Processing Account: ${account.page_name || account.page_id} (${account.platform})`);

        try {
            // 2. Fetch Posts from Meta Graph API
            const postsUrl = `https://graph.facebook.com/v19.0/${account.page_id}/posts?access_token=${account.access_token}&limit=5`;
            const postsRes = await fetch(postsUrl);
            const postsData = await postsRes.json() as any;

            if (postsData.error) {
                console.error(`   ❌ Failed to fetch posts: ${postsData.error.message}`);
                continue;
            }

            const posts = postsData.data || [];
            console.log(`   Found ${posts.length} recent posts.`);

            for (const post of posts) {
                console.log(`   📝 Post ID: ${post.id}`);

                // 3. Fetch Comments for each post
                const commentsUrl = `https://graph.facebook.com/v19.0/${post.id}/comments?access_token=${account.access_token}`;
                const commentsRes = await fetch(commentsUrl);
                const commentsData = await commentsRes.json() as any;

                if (commentsData.error) {
                    console.error(`      ❌ Failed to fetch comments: ${commentsData.error.message}`);
                    continue;
                }

                const comments = commentsData.data || [];
                console.log(`      Found ${comments.length} comments.`);

                for (const comment of comments) {
                    // 4. Transform to n8n Webhook Payload
                    // n8n expects Meta Webhook format (simplified by Extract Payload node)
                    // But our Extract Payload node also handles pass-through.
                    // Let's send a payload that simulates the webhook to trigger full classification/storage.

                    const payload = {
                        object: account.platform === 'facebook' ? 'page' : 'instagram',
                        entry: [{
                            id: account.page_id,
                            changes: [{
                                value: {
                                    item: 'comment',
                                    message: comment.message,
                                    text: comment.message, // for IG
                                    comment_id: comment.id,
                                    id: comment.id, // for IG
                                    post_id: post.id,
                                    media: { id: post.id }, // for IG
                                    from: {
                                        id: comment.from?.id || 'manual_ingest',
                                        name: comment.from?.name || 'Manual Ingest',
                                        username: comment.from?.name || 'Manual Ingest'
                                    }
                                }
                            }]
                        }]
                    };

                    const n8nRes = await fetch(n8nWebhookUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (n8nRes.ok) {
                        console.log(`      ✅ Sent comment ${comment.id} to n8n`);
                    } else {
                        const err = await n8nRes.text();
                        console.error(`      ❌ Failed to send comment ${comment.id}: ${err}`);
                    }
                }
            }
        } catch (err: any) {
            console.error(`   ❌ Unexpected error: ${err.message}`);
        }
    }

    console.log('\n✅ Ingestion Job Complete.');
}

ingest();

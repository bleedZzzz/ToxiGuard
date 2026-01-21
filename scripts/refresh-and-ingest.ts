
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const userAccessToken = process.env.META_USER_ACCESS_TOKEN!;
const n8nWebhookUrl = process.env.N8N_BASE_URL ? `${process.env.N8N_BASE_URL.replace(/\/$/, '')}/webhook/classify-comment` : 'http://localhost:5678/webhook/classify-comment';

const supabase = createClient(supabaseUrl, supabaseKey);

// Known Page ID from previous successful connections
const FORCE_PAGE_ID = '976828372182708';

async function ingest() {
    console.log('🚀 Starting Robust Ingestion...');

    let accountsToProcess = [];

    // 1. Try to fetch pages normally
    console.log('📡 Fetching pages from /me/accounts...');
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`);
    const pagesData = await pagesRes.json() as any;

    if (pagesData.data && pagesData.data.length > 0) {
        for (const page of pagesData.data) {
            accountsToProcess.push({
                id: page.id,
                name: page.name,
                token: page.access_token
            });
            // Update DB
            await supabase.from('social_accounts').upsert({
                page_id: page.id,
                page_name: page.name,
                access_token: page.access_token,
                platform: 'facebook'
            }, { onConflict: 'page_id' });
        }
    } else {
        console.warn('⚠️ /me/accounts returned no pages. Trying to fetch token for specific Page ID...');
        // Try to get token for our forced page ID directly
        const pageTokenRes = await fetch(`https://graph.facebook.com/v19.0/${FORCE_PAGE_ID}?fields=access_token,name&access_token=${userAccessToken}`);
        const pageTokenData = await pageTokenRes.json() as any;

        if (pageTokenData.access_token) {
            console.log(`✅ Successfully retrieved token for ${pageTokenData.name} directly!`);
            accountsToProcess.push({
                id: FORCE_PAGE_ID,
                name: pageTokenData.name,
                token: pageTokenData.access_token
            });
            await supabase.from('social_accounts').upsert({
                page_id: FORCE_PAGE_ID,
                page_name: pageTokenData.name,
                access_token: pageTokenData.access_token,
                platform: 'facebook'
            }, { onConflict: 'page_id' });
        } else {
            console.error('❌ Could not find any pages or get a token. Error:', pageTokenData.error?.message || 'Unknown error');
            console.log('💡 TIP: When generating the token in Graph API Explorer, make sure to select your PAGE in the "User or Page" dropdown.');
            return;
        }
    }

    // 2. Process Ingestion
    for (const account of accountsToProcess) {
        console.log(`\n📂 Ingesting from: ${account.name}`);

        const postsRes = await fetch(`https://graph.facebook.com/v19.0/${account.id}/feed?access_token=${account.token}&limit=25`);
        const postsData = await postsRes.json() as any;

        if (postsData.error) {
            console.error(`   ❌ Failed to fetch posts: ${postsData.error.message}`);
            continue;
        }

        const posts = postsData.data || [];
        console.log(`   Found ${posts.length} posts.`);

        for (const post of posts) {
            console.log(`   📝 Post: ${post.id} (${post.message || 'No message'})`);
            const commsUrl = `https://graph.facebook.com/v19.0/${post.id}/comments?access_token=${account.token}`;
            const commsRes = await fetch(commsUrl);
            const commsData = await commsRes.json() as any;

            if (commsData.error) {
                console.error(`      ❌ Failed to fetch comments: ${commsData.error.message}`);
                continue;
            }

            const comments = commsData.data || [];
            console.log(`      Found ${comments.length} comments.`);

            for (const comment of comments) {
                console.log(`      💬 Comment: ${comment.message}`);
                const payload = {
                    object: 'page',
                    entry: [{
                        id: account.id,
                        changes: [{
                            value: {
                                item: 'comment',
                                message: comment.message,
                                comment_id: comment.id,
                                post_id: post.id,
                                from: {
                                    id: comment.from?.id || 'manual_ingest',
                                    name: comment.from?.name || 'Manual Ingest'
                                }
                            }
                        }]
                    }]
                };

                await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                console.log(`      ✅ Sent comment ${comment.id} to n8n`);
            }
        }
    }

    console.log('\n✨ Ingestion Complete.');
}

ingest();

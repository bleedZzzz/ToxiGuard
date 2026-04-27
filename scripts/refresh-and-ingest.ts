
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const userAccessToken = process.env.META_USER_ACCESS_TOKEN!;

// Post directly to our own Next.js webhook endpoint (no n8n)
const webhookUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')}/api/webhook/facebook`
    : 'http://localhost:3000/api/webhook/facebook';

const supabase = createClient(supabaseUrl, supabaseKey);

// Known Page ID from environment
const FORCE_PAGE_ID = process.env.META_PAGE_ID || '1614940733203422';

async function ingest() {
    console.log('🚀 Starting Ingestion...');
    console.log(`📡 Webhook Target: ${webhookUrl}`);

    let accountsToProcess = [];

    // 1. Try to fetch pages normally
    console.log('📡 Validating Token Type...');
    const debugUrl = `https://graph.facebook.com/debug_token?input_token=${userAccessToken}&access_token=${process.env.META_APP_ID}|${process.env.META_APP_SECRET}`;
    const debugRes = await fetch(debugUrl);
    const debugData = await debugRes.json() as any;

    if (debugData.data?.type === 'PAGE') {
        console.log('✅ Detected PAGE Token. Fetching page details...');
        const pageRes = await fetch(`https://graph.facebook.com/v19.0/${FORCE_PAGE_ID}?fields=name&access_token=${userAccessToken}`);
        const pageData = await pageRes.json() as any;

        accountsToProcess.push({
            id: FORCE_PAGE_ID,
            name: pageData.name || 'Facebook Page',
            token: userAccessToken
        });
        // Update DB
        await supabase.from('social_accounts').upsert({
            page_id: FORCE_PAGE_ID,
            page_name: pageData.name || 'Facebook Page',
            access_token: userAccessToken,
            platform: 'facebook',
            user_id: 'da554f2f-6c3f-49b7-83b5-b2aa1763464b'
        }, { onConflict: 'page_id' });
    } else {
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
            }
        } else {
            console.error('❌ Could not find any pages. Error:', pagesData.error?.message || 'Unknown error');
            return;
        }
    }

    // 2. Process Ingestion
    let totalProcessed = 0;
    let totalErrors = 0;

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

                // Build a Facebook webhook-compatible payload
                const payload = {
                    object: 'page',
                    entry: [{
                        id: account.id,
                        changes: [{
                            value: {
                                item: 'comment',
                                verb: 'add',
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

                try {
                    const res = await fetch(webhookUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    const responseData = await res.json();
                    console.log(`      📡 Status: ${res.status}`);

                    if (res.ok) {
                        totalProcessed++;
                        console.log(`      ✅ Processed:`, JSON.stringify(responseData));
                    } else {
                        totalErrors++;
                        console.error(`      ❌ Error:`, JSON.stringify(responseData));
                    }
                } catch (err: any) {
                    totalErrors++;
                    console.error(`      ❌ Request failed: ${err.message}`);
                }
            }
        }
    }

    console.log(`\n✨ Ingestion Complete. Processed: ${totalProcessed}, Errors: ${totalErrors}`);
}

ingest();

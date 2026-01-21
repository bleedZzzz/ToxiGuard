
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const n8nUrl = 'http://localhost:5678/webhook/classify-comment'; // Adjust if needed

const testComments = [
    "You are a great person, have a nice day!",
    "I don't agree with you, but I respect your opinion.",
    "You are such an idiot, I can't believe you exist.",
    "DIE DIE DIE I HATE YOU SO MUCH!!!!!!",
    "This is spam, buy cheap watches at fake-link.com"
];

async function testAI() {
    console.log('🧪 Testing AI Classification via n8n...\n');

    for (const content of testComments) {
        console.log(`💬 Testing: "${content}"`);

        // Example of a Meta webhook payload structure
        const TEST_PAYLOAD = {
            body: {
                object: "instagram",
                entry: [
                    {
                        id: "17841400000000000",
                        time: 1678900000,
                        changes: [
                            {
                                value: {
                                    from: {
                                        id: "123456789",
                                        username: "test_user"
                                    },
                                    id: "17900000000000000", // comment_id
                                    parent_id: "manual_test_post_1", // post_id
                                    text: "Place holder text",
                                    created_time: 1678900000
                                },
                                field: "comments"
                            }
                        ]
                    }
                ]
            }
        };

        // Simplified Payload Structure that our workflow might expect directly if bypassing Meta logic:
        const DIRECT_PAYLOAD = {
            body: {
                post_id: "manual_test_post_1",
                comment: {
                    id: `test_comment_${Date.now()}`,
                    content: "Placeholder Content",
                },
                commenter_name: "Test User"
            }
        };
        try {
            const res = await fetch(n8nUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    body: {
                        comment: {
                            content: content,
                            id: `test_${Date.now()}_${Math.random()}`
                        },
                        page_id: "976828372182708",
                        post_id: "manual_test_post_1", // Updated post_id
                        commenter_name: "Test User"
                    }
                })
            });

            console.log(`📊 Status: ${res.status} ${res.statusText}`);

            if (!res.ok) {
                console.error(`❌ Error Body: ${await res.text()}`);
                continue;
            }

            const text = await res.text();
            if (!text) {
                console.warn(`⚠️ Warning: Received empty response body.`);
                continue;
            }
            try {
                const data = JSON.parse(text) as any;
                console.log(`✅ Result Label:`, data.classification?.label);
                console.log(`✅ Result Score:`, data.classification?.score);
                if (data.classification?.groq_raw) {
                    // console.log(`🔍 Groq Raw Response:`, JSON.stringify(data.classification.groq_raw, null, 2).substring(0, 1000));
                }
                console.log(`👤 User ID Debug:`, data.classification?.user_id_debug);
                console.log(`📝 Create Report Debug:`, JSON.stringify(data.classification?.create_report_debug || {}, null, 2));
                console.log(`📊 Log Score Debug:`, JSON.stringify(data.classification?.log_score_debug || {}, null, 2));
                console.log(`   Flagged: ${data.flagged_for_review}\n`);
            } catch (pErr) {
                console.error(`❌ JSON Parse Error: ${text}`);
            }

        } catch (err: any) {
            console.error(`❌ Connection Error: ${err.message}. Is n8n running?`);
        }
    }
}

testAI();

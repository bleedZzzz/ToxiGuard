
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
                        post_id: "976828372182708_122099207301229451",
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
                console.log(`✅ Result: ${data.classification?.label || 'no-label'} (Score: ${data.classification?.score || 0})`);
                if (data.classification?.error) {
                    console.log(`   ❌ Error: ${data.classification.error}`);
                    console.log(`   📝 Raw: ${JSON.stringify(data.classification.raw, null, 2)}`);
                }
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

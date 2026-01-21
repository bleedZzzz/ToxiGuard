
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

            if (!res.ok) {
                console.error(`❌ Error ${res.status}: ${await res.text()}`);
                continue;
            }

            const data = await res.json() as any;
            console.log(`✅ Result: ${data.classification.label} (Score: ${data.classification.score})`);
            console.log(`   Flagged: ${data.flagged_for_review}\n`);

        } catch (err: any) {
            console.error(`❌ Connection Error: ${err.message}. Is n8n running?`);
        }
    }
}

testAI();

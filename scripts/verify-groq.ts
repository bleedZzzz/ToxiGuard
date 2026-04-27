import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const groqKey = process.env.GROQ_API_KEY!;

async function verifyGroq() {
    console.log('Testing Groq AI...');
    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: 'Say hello' }]
            })
        });
        const data = await res.json() as any;
        if (data.error) {
            console.error('❌ Groq Error:', data.error.message);
        } else {
            console.log('✅ Groq Success! Response:', data.choices?.[0]?.message?.content);
        }
    } catch (e) {
        console.error('❌ Fetch Error:', e);
    }
}

verifyGroq();

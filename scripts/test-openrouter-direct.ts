import * as dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function testOpenRouter() {
    console.log('🚀 Testing OpenRouter API directly with fetch...');
    try {
        // Test 1: Chat Completion
        console.log('--- Test 1: Chat Completion ---');
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'ToxiGuard Dev',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'google/gemma-2-9b-it:free',
                messages: [
                    { role: 'user', content: 'Say hello' }
                ]
            })
        });

        console.log('Chat Status:', response.status);
        const data = await response.json();
        console.log('Chat Data:', JSON.stringify(data, null, 2));

        // Test 2: List Models
        console.log('\n--- Test 2: List Models ---');
        const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'ToxiGuard Dev',
            }
        });

        console.log('Models Status:', modelsResponse.status);
        // Don't log full data for models as it's huge, just check if it works
        if (modelsResponse.ok) {
            console.log('✅ Models List Success!');
        } else {
            const modelsData = await modelsResponse.json();
            console.log('❌ Models List Failed:', JSON.stringify(modelsData, null, 2));
        }
    }

    catch (error) {
        console.error('❌ Network/System Error:', error);
    }
}

testOpenRouter();

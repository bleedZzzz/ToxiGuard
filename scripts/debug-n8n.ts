
import fetch from 'node-fetch';

async function debugN8n() {
    console.log('🧪 Sending manual test to n8n...');
    const payload = {
        comment: {
            content: "You are a piece of trash. I hate you.",
            id: "debug_" + Date.now()
        },
        page_id: "1614940733203422",
        post_id: "debug_post",
        commenter_name: "Debug User"
    };

    try {
        const res = await fetch('http://localhost:5678/webhook/classify-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

debugN8n();

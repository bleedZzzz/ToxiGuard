
async function testN8N() {
    const url = 'http://localhost:5678/webhook/classify-comment';
    const payload = {
        object: 'page',
        entry: [{
            id: '976828372182708', // REAL Page ID from DB
            changes: [{
                value: {
                    item: 'comment',
                    message: 'THIS IS A TOXIC TEST COMMENT YOU ARE STUPID',
                    comment_id: 'test_comment_' + Date.now(),
                    post_id: 'test_post_1',
                    from: {
                        id: 'test_user_1',
                        name: 'Test User'
                    }
                }
            }]
        }]
    };

    console.log(`Testing n8n at ${url}...`);
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (err: any) {
        console.error('Error:', err.message || err);
    }
}

testN8N();

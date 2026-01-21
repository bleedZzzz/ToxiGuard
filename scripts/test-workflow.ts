

async function testWorkflow() {
    const url = 'http://localhost:5678/webhook/classify-comment';
    const body = {
        object: 'page',
        entry: [
            {
                changes: [
                    {
                        field: 'feed',
                        value: {
                            item: 'comment',
                            comment_id: 'test_comment_123',
                            message: 'You are stupid and ugly',
                            post_id: 'test_post_456',
                            from: {
                                id: 'user_789',
                                name: 'Test User'
                            }
                        }
                    }
                ]
            }
        ]
    };

    // NOTE: The workflow expects a simplified body structure because the Webhook node likely doesn't parse the complex FB structure perfectly unless designed to. 
    // Let's check the workflow first.
    // Viewing classification_workflow.json lines 25-35: 
    // value1: "={{ $json.body.comment.content }}"
    // So it expects body.comment.content directly.

    const simplifiedBody = {
        comment: {
            content: "You are stupid and ugly",
            id: "test_comment_123",
            user_id: "test_user_789"
        }
    };

    console.log('Sending test payload to:', url);
    console.log('Payload:', JSON.stringify(simplifiedBody, null, 2));

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(simplifiedBody)
        });

        const text = await res.text();
        console.log('Response Status:', res.status);
        console.log('Response Body:', text);
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testWorkflow();

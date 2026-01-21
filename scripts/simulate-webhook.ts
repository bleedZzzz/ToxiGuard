
import fetch from 'node-fetch';

async function simulateWebhook() {
    // We can hit the Tunnel URL to test the FULL path (Tunnel -> n8n)
    const url = 'https://thorough-suspended-mobility-turbo.trycloudflare.com/webhook/classify-comment';

    // Payload mimicking a real Facebook Feed Comment Event
    const payload = {
        "object": "page",
        "entry": [
            {
                "id": "976828372182708",
                "time": 1520383571,
                "changes": [
                    {
                        "value": {
                            "from": {
                                "id": "44444444",
                                "name": "Test User"
                            },
                            "item": "comment",
                            "comment_id": "comment_id_12345_test",
                            "verb": "add",
                            "parent_id": "post_id_12345",
                            "post_id": "post_id_12345",
                            "message": "You are completely useless and nobody likes you, delete this account immediately!",
                            "created_time": 1520383571
                        },
                        "field": "feed"
                    }
                ]
            }
        ]
    };

    console.log(`Sending POST to: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text}`);

    } catch (error) {
        console.error('❌ Failed to send webhook:', error);
    }
}

simulateWebhook();

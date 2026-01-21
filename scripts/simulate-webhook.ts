import fetch from 'node-fetch';

async function simulateWebhook() {
    // We can hit the Tunnel URL to test the FULL path (Tunnel -> n8n)
    const url = 'http://localhost:3000/api/webhook/facebook';

    // Payload mimicking a real Facebook Feed Comment Event
    const payload = {
        "object": "page",
        "entry": [
            {
                "id": "976828372182708", // REAL Page ID
                "time": 1699999999,
                "changes": [
                    {
                        "value": {
                            "from": {
                                "id": "106728097437812", // Simulated User
                                "name": "Simulation User"
                            },
                            "item": "comment",
                            "comment_id": "comment_id_simulation_" + Date.now(),
                            "verb": "add",
                            "parent_id": "post_id_12345", // Keeping this from original as not explicitly removed
                            "post_id": "post_id_simulation_1",
                            "message": "You are completely useless and nobody likes you, delete this account immediately!",
                            "created_time": 1699999999
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

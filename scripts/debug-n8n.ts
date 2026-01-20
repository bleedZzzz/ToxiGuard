
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_WORKFLOW_ID = process.env.N8N_WORKFLOW_ID;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

async function debugWorkflow() {
    if (!N8N_API_KEY || !N8N_WORKFLOW_ID) {
        console.error('Missing env vars');
        return;
    }

    console.log(`Fetching workflow ${N8N_WORKFLOW_ID}...`);
    const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
    });

    if (!res.ok) {
        console.error('Failed to get workflow:', await res.text());
        return;
    }

    const data = await res.json();
    console.log(`Active: ${data.active}`);

    const nodes = data.nodes.map((n: any) => ({
        name: n.name,
        type: n.type,
        method: n.parameters?.httpMethod,
        path: n.parameters?.path
    }));

    const getWebhook = nodes.find((n: any) => n.method === 'GET' && n.path === 'classify-comment');

    if (getWebhook) {
        console.log('✅ Found GET Webhook node:');
        console.log(JSON.stringify(getWebhook, null, 2));
    } else {
        console.error('❌ GET Webhook node NOT found!');
    }
}

debugWorkflow();



import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_WORKFLOW_ID = process.env.N8N_WORKFLOW_ID;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

async function activateWorkflow() {
    if (!N8N_API_KEY || !N8N_WORKFLOW_ID) {
        console.error('Missing env vars');
        return;
    }

    // 1. Check Status
    console.log(`Checking status of workflow ${N8N_WORKFLOW_ID}...`);
    const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}`, {
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
    });

    if (!res.ok) {
        console.error('Failed to get workflow:', await res.text());
        return;
    }

    const data = await res.json();
    console.log(`Current active status: ${data.active}`);

    if (data.active) {
        console.log('Workflow is active. Deactivating to refresh...');
        const deactivateRes = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}/deactivate`, {
            method: 'POST',
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });
        if (!deactivateRes.ok) console.error('Failed to deactivate');
    }

    // 2. Activate
    console.log('Activating workflow...');
    const activateRes = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}/activate`, {
        method: 'POST',
        headers: { 'X-N8N-API-KEY': N8N_API_KEY }
    });

    if (activateRes.ok) {
        console.log('✅ Workflow activated successfully!');
    } else {
        console.error('❌ Failed to activate:', await activateRes.text());
    }
}

activateWorkflow();


import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';

async function listWorkflows() {
    try {
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY! }
        });

        if (!response.ok) {
            console.error('Failed to list workflows:', await response.text());
            return;
        }

        const data = await response.json();
        console.log('Workflows:', JSON.stringify(data.data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listWorkflows();

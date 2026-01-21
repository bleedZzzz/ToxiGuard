
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_WORKFLOW_ID = process.env.N8N_WORKFLOW_ID;
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://localhost:5678';
const WORKFLOW_FILE_PATH = path.join(__dirname, '../backend/n8n/classification_workflow.json');

if (!N8N_API_KEY || !N8N_WORKFLOW_ID) {
    console.error('❌ Error: Missing N8N_API_KEY or N8N_WORKFLOW_ID in .env file.');
    process.exit(1);
}

async function syncWorkflow() {
    let workflowJson: any;
    try {
        console.log('🔄 Reading local workflow file...');
        const workflowData = fs.readFileSync(WORKFLOW_FILE_PATH, 'utf8');
        workflowJson = JSON.parse(workflowData);

        console.log(`🚀 push to n8n instance (${N8N_BASE_URL})...`);
        const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${N8N_WORKFLOW_ID}`, {
            method: 'PUT',
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY!,
                'Content-Type': 'application/json',
            } as Record<string, string>,
            body: JSON.stringify({
                name: workflowJson.name,
                nodes: workflowJson.nodes,
                connections: workflowJson.connections,
                settings: workflowJson.settings || {},
                staticData: workflowJson.staticData,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`n8n API responded with ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('✅ Successfully updated workflow in n8n!');
        console.log(`   ID: ${responseData.id}`);
        console.log(`   Name: ${responseData.name}`);

        // If successful, push to git
        console.log('\n📦 Pushing changes to GitHub...');
        execSync('git add .', { stdio: 'inherit' });
        try {
            execSync('git commit -m "Update n8n workflow"', { stdio: 'inherit' });
        } catch (e) {
            console.log('   (No changes to commit)');
        }
        execSync('git push', { stdio: 'inherit' });
        console.log('✅ Successfully pushed to GitHub!');

    } catch (error: any) {
        if (error.message.includes('404')) {
            console.log('⚠️ Workflow not found. Creating a new one...');
            try {
                const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, {
                    method: 'POST',
                    headers: {
                        'X-N8N-API-KEY': N8N_API_KEY!,
                        'Content-Type': 'application/json',
                    } as Record<string, string>,
                    body: JSON.stringify({
                        name: workflowJson.name,
                        nodes: workflowJson.nodes,
                        connections: workflowJson.connections,
                        settings: workflowJson.settings || {},
                        staticData: workflowJson.staticData,
                    }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to create workflow: ${await response.text()}`);
                }

                const newWorkflow = await response.json();
                console.log('✅ Successfully created new workflow!');
                console.log(`🆕 NEW ID: ${newWorkflow.id}`);
                console.log('⚠️ IMPORTANT: Please update your .env file with this new N8N_WORKFLOW_ID!');
                return;
            } catch (createError: any) {
                console.error('❌ Failed to create workflow:', createError.message);
                process.exit(1);
            }
        }
        console.error('❌ Failed to sync workflow:', error.message);
        process.exit(1);
    }
}

syncWorkflow();


import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const originalPath = path.join(__dirname, '../backend/n8n/classification_workflow.json');
const raw = fs.readFileSync(originalPath, 'utf8');
const workflow = JSON.parse(raw);

// Helper to create Supabase Node
function createSupabaseNode(name, method, urlPath, bodyParams, position) {
    return {
        "parameters": {
            "method": method,
            "url": `={{ $env.NEXT_PUBLIC_SUPABASE_URL }}/rest/v1/${urlPath}`,
            "sendHeaders": true,
            "headerParameters": {
                "parameters": [
                    { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_ROLE_KEY }}" },
                    { "name": "Authorization", "value": "=Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}" },
                    { "name": "Content-Type", "value": "application/json" },
                    { "name": "Prefer", "value": "resolution=merge-duplicates" }, // For Upsert
                    { "name": "Accept", "value": "application/vnd.pgrst.object+json" } // Force single object
                ]
            },
            "sendBody": true,
            "bodyParameters": {
                "parameters": bodyParams
            },
            "options": {}
        },
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 3,
        "position": position,
        "continueOnFail": true
    };
}

// 1. Update Extract Payload to include necessary fields
const extractNode = workflow.nodes.find(n => n.name === 'Extract Payload');
extractNode.parameters.jsCode = `const body = $input.item.json.body;

// Check if it's a verify challenge (already handled) or a feed event
if (body.object === 'page' && body.entry && body.entry[0].changes && body.entry[0].changes[0].value.item === 'comment') {
  const commentData = body.entry[0].changes[0].value;
  return {
    json: {
      body: {
        comment: {
          content: commentData.message,
          id: commentData.comment_id,
          user_id: commentData.from.id
        },
        page_id: body.entry[0].id,
        post_id: commentData.post_id,
        commenter_name: commentData.from.name
      }
    }
  };
}

// Pass through if structure is different (or test simulation)
return {
  json: $input.item.json
};`;

// 2. Add "Get Owner" Node (Lookup social_accounts)
const getOwnerNode = {
    "parameters": {
        "method": "GET",
        "url": "={{ $env.NEXT_PUBLIC_SUPABASE_URL }}/rest/v1/social_accounts",
        "sendHeaders": true,
        "headerParameters": {
            "parameters": [
                { "name": "apikey", "value": "={{ $env.SUPABASE_SERVICE_ROLE_KEY }}" },
                { "name": "Authorization", "value": "=Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}" },
                { "name": "Accept", "value": "application/vnd.pgrst.object+json" }
            ]
        },
        "sendQuery": true,
        "queryParameters": {
            "parameters": [
                { "name": "page_id", "value": "eq.{{ $('Extract Payload').item.json.body.page_id }}" },
                { "name": "select", "value": "user_id" }
            ]
        }
    },
    "name": "Get Page Owner",
    "type": "n8n-nodes-base.httpRequest",
    "typeVersion": 3,
    "position": [500, 300]
};

// 3. Add "Upsert Post" Node
// Note: using .user_id directly now
const upsertPostNode = createSupabaseNode("Upsert Post", "POST", "posts", [
    { "name": "id", "value": "={{ $('Extract Payload').item.json.body.post_id }}" },
    { "name": "user_id", "value": "da554f2f-6c3f-49b7-83b5-b2aa1763464b" },
    { "name": "content", "value": "Post content placeholder" }
], [700, 300]);

// 4. Add "Upsert Comment" Node
const upsertCommentNode = createSupabaseNode("Upsert Comment", "POST", "comments", [
    { "name": "id", "value": "={{ $('Extract Payload').item.json.body.comment.id }}" },
    { "name": "post_id", "value": "={{ $('Extract Payload').item.json.body.post_id }}" },
    { "name": "user_id", "value": "da554f2f-6c3f-49b7-83b5-b2aa1763464b" },
    { "name": "content", "value": "={{ $('Extract Payload').item.json.body.comment.content }}" },
    { "name": "commenter_name", "value": "={{ $('Extract Payload').item.json.body.commenter_name }}" }
], [900, 300]);


// 5. Update Respond Success to return Debug Info
const respondNode = workflow.nodes.find(n => n.name === 'Respond Success');
respondNode.parameters.respondWith = "text";
respondNode.parameters.responseBody = "DEBUG_CHECK_WORKS";

// REWIRE NODES (SHIFT RIGHT)
const shiftX = 800;
['OpenRouter AI', 'Parse Response', 'Smart Routing', 'Create Report', 'Log Score', 'Respond Success', 'Respond Error'].forEach(name => {
    const node = workflow.nodes.find(n => n.name === name);
    if (node) node.position[0] += shiftX;
});

// Add new nodes
workflow.nodes.push(getOwnerNode, upsertPostNode, upsertCommentNode);

// Update Connections
// Validate Input -> Get Page Owner
workflow.connections["Validate Input"].main[0][0].node = "Get Page Owner";

// Get Page Owner -> Upsert Post
workflow.connections["Get Page Owner"] = { "main": [[{ "node": "Upsert Post", "type": "main", "index": 0 }]] };

// Upsert Post -> Upsert Comment
workflow.connections["Upsert Post"] = { "main": [[{ "node": "Upsert Comment", "type": "main", "index": 0 }]] };

// Upsert Comment -> Respond Success (Short Circuit for Debugging)
workflow.connections["Upsert Comment"] = { "main": [[{ "node": "Respond Success", "type": "main", "index": 0 }]] };


// Save v3
fs.writeFileSync(path.join(__dirname, '../backend/n8n/classification_workflow_v3.json'), JSON.stringify(workflow, null, 4));
console.log('Generated v3 workflow (DEBUG MODE)');

#!/usr/bin/env node

/**
 * Ask Product GPT MCP Server
 * 
 * Exposes OpenGov product expert assistants to Claude Code via Model Context Protocol.
 * 
 * Environment variables required:
 * - OPENAI_API_KEY_MAIN (for FIN, GAB, BP, PRO, EAM)
 * - OPENAI_API_KEY_PLC (for PLC)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================================================
// Product Expert Assistant Mappings
// ============================================================================

const PRODUCT_ASSISTANTS = {
  FIN: {
    id: 'asst_jMgNdlEIpOIlV8ouMcVL2RTN',
    name: 'Financials',
    description: 'Expert on OpenGov Financials product',
    projectId: 'proj_jkr82Y3XT9EtbivW3vJJIzaJ',
    apiKeyEnv: 'OPENAI_API_KEY_MAIN',
  },
  GAB: {
    id: 'asst_jWuKVKQSgFuMxNqbzYzKYqpa',
    name: 'Government App Builder',
    description: 'Expert on OpenGov Government App Builder',
    projectId: 'proj_jkr82Y3XT9EtbivW3vJJIzaJ',
    apiKeyEnv: 'OPENAI_API_KEY_MAIN',
  },
  BP: {
    id: 'asst_ma3Sl42rv8QVrhQ0b9PDiadq',
    name: 'Budgeting & Performance',
    description: 'Expert on OpenGov Budgeting & Performance product',
    projectId: 'proj_jkr82Y3XT9EtbivW3vJJIzaJ',
    apiKeyEnv: 'OPENAI_API_KEY_MAIN',
  },
  PRO: {
    id: 'asst_hJ2pIMBCFTmHXQDrWqYum4NW',
    name: 'Procurement & Contract Management',
    description: 'Expert on OpenGov Procurement & Contract Management',
    projectId: 'proj_jkr82Y3XT9EtbivW3vJJIzaJ',
    apiKeyEnv: 'OPENAI_API_KEY_MAIN',
  },
  EAM: {
    id: 'asst_pBozZc7P3RbhDKrhNz7OC6Zs',
    name: 'Enterprise Asset Management',
    description: 'Expert on OpenGov Enterprise Asset Management',
    projectId: 'proj_jkr82Y3XT9EtbivW3vJJIzaJ',
    apiKeyEnv: 'OPENAI_API_KEY_MAIN',
  },
  PLC: {
    id: 'asst_6q9Xri6QqcLkHKDfVMKWK5BG',
    name: 'Permitting & Licensing',
    description: 'Expert on OpenGov Permitting & Licensing',
    projectId: 'proj_O31xbO2kYYsBkpNYFbvN8rNe',
    apiKeyEnv: 'OPENAI_API_KEY_PLC',
  },
};

// ============================================================================
// OpenAI API Helper
// ============================================================================

async function createOpenAIRequest(apiKey, endpoint, method, body) {
  const url = `https://api.openai.com/v1/${endpoint}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// Tool Definitions
// ============================================================================

const tools = [
  {
    name: "ask_product_expert",
    description: `Ask a product-specific expert assistant about OpenGov products. Use this when you need detailed information about specific OpenGov product features, capabilities, best practices, or technical details.

AVAILABLE PRODUCTS:
- FIN: Financials product expert
- GAB: Government App Builder expert
- BP: Budgeting & Performance expert
- PRO: Procurement & Contract Management expert
- EAM: Enterprise Asset Management expert
- PLC: Permitting & Licensing expert

Use this tool when:
- Users ask about specific product features, capabilities, or functionality
- You need technical details about how a product works
- You need product-specific best practices or recommendations
- You need to understand product limitations or requirements
- The question requires deep product knowledge beyond general information

CONVERSATION CONTINUITY:
- If you want to continue a conversation with the same expert, use the thread_id from the previous response
- The expert will remember the entire conversation history in that thread
- This is useful for follow-up questions or multi-turn discussions`,
    inputSchema: {
      type: "object",
      properties: {
        product: {
          type: "string",
          description: "The product code to query: FIN, GAB, BP, PRO, EAM, or PLC",
          enum: ["FIN", "GAB", "BP", "PRO", "EAM", "PLC"]
        },
        question: {
          type: "string",
          description: "The specific question to ask the product expert. Be clear and detailed."
        },
        context: {
          type: "string",
          description: "Optional additional context about the customer, use case, or specific scenario"
        },
        thread_id: {
          type: "string",
          description: "Optional thread ID from a previous conversation with this product expert. If provided, the conversation will continue in the same thread with full context history."
        }
      },
      required: ["product", "question"]
    }
  },
  {
    name: "list_product_experts",
    description: "List all available product expert assistants and their specializations",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  }
];

// ============================================================================
// Tool Handlers
// ============================================================================

async function handleToolCall(name, args) {
  try {
    switch (name) {
      case "list_product_experts": {
        let result = "**Available Product Expert Assistants:**\n\n";
        for (const [code, assistant] of Object.entries(PRODUCT_ASSISTANTS)) {
          result += `- **${code}**: ${assistant.name}\n  ${assistant.description}\n\n`;
        }
        return result;
      }

      case "ask_product_expert": {
        const productCode = args.product.toUpperCase();
        
        if (!(productCode in PRODUCT_ASSISTANTS)) {
          return `Error: Invalid product code: ${args.product}. Must be one of: FIN, GAB, BP, PRO, EAM, PLC`;
        }

        const assistant = PRODUCT_ASSISTANTS[productCode];
        const apiKey = process.env[assistant.apiKeyEnv];
        
        if (!apiKey) {
          return `Error: Missing API key. Please set ${assistant.apiKeyEnv} in your environment variables`;
        }

        // Use existing thread or create a new one
        let threadId;
        if (args.thread_id) {
          threadId = args.thread_id;
        } else {
          const thread = await createOpenAIRequest(apiKey, 'threads', 'POST');
          threadId = thread.id;
        }

        // Build the message with optional context
        let messageContent = args.question;
        if (args.context) {
          messageContent = `Context: ${args.context}\n\nQuestion: ${args.question}`;
        }

        // Add the user's question to the thread
        await createOpenAIRequest(apiKey, `threads/${threadId}/messages`, 'POST', {
          role: 'user',
          content: messageContent,
        });

        // Run the assistant
        const run = await createOpenAIRequest(apiKey, `threads/${threadId}/runs`, 'POST', {
          assistant_id: assistant.id,
        });

        // Poll for completion
        let runStatus = await createOpenAIRequest(apiKey, `threads/${threadId}/runs/${run.id}`, 'GET');
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds maximum wait time

        while (runStatus.status !== 'completed' && runStatus.status !== 'failed' && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          runStatus = await createOpenAIRequest(apiKey, `threads/${threadId}/runs/${run.id}`, 'GET');
          attempts++;

          // Handle other statuses
          if (runStatus.status === 'requires_action') {
            return `Error: Assistant requested additional actions which are not supported in this context (Status: ${runStatus.status})`;
          }
        }

        if (runStatus.status === 'failed') {
          return `Error: Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`;
        }

        if (attempts >= maxAttempts) {
          return `Error: Assistant response timed out after 60 seconds`;
        }

        // Retrieve the assistant's response
        const messages = await createOpenAIRequest(apiKey, `threads/${threadId}/messages`, 'GET');
        const assistantMessages = messages.data
          .filter(msg => msg.role === 'assistant')
          .sort((a, b) => b.created_at - a.created_at);

        if (assistantMessages.length === 0) {
          return `Error: No response received from assistant`;
        }

        // Extract text content from the latest assistant message
        const latestMessage = assistantMessages[0];
        const textContent = latestMessage.content
          .filter(content => content.type === 'text')
          .map(content => content.text?.value || '')
          .join('\n\n');

        // Format response
        let result = `**Product Expert: ${assistant.name} (${productCode})**\n`;
        result += args.thread_id ? '*(Continuing previous conversation)*\n\n' : '*(New conversation)*\n\n';
        result += `**Question:** ${args.question}\n\n`;
        result += `**Answer:**\n${textContent}\n\n`;
        result += `---\n*Thread ID: \`${threadId}\`* (Use this to continue the conversation)\n`;
        result += `*Run ID: \`${run.id}\`*`;

        return result;
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new Server(
  { name: "ask-product-gpt", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await handleToolCall(name, args || {});
  return {
    content: [{ type: "text", text: result }]
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ask Product GPT MCP server running on stdio");
}

main().catch(console.error);

#!/usr/bin/env node

/**
 * Aha! MCP Server
 * 
 * Exposes Aha! tools to Claude Code via Model Context Protocol.
 * 
 * Environment variables required:
 * - AHA_SUBDOMAIN
 * - AHA_API_TOKEN
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ============================================================================
// Aha! API Helper
// ============================================================================

async function fetchFromAha(endpoint) {
  const subdomain = process.env.AHA_SUBDOMAIN;
  const apiToken = process.env.AHA_API_TOKEN;

  if (!subdomain || !apiToken) {
    throw new Error("Aha! credentials not configured. AHA_SUBDOMAIN and AHA_API_TOKEN environment variables are required.");
  }

  const url = `https://${subdomain}.aha.io/api/v1/${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Aha! API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// ============================================================================
// Tool Definitions
// ============================================================================

const tools = [
  // Products
  {
    name: "aha_products_list",
    description: "List all products from Aha!",
    inputSchema: { type: "object", properties: {}, required: [] }
  },
  {
    name: "aha_products_get_details",
    description: "Get detailed information about a specific Aha! product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID or reference prefix (e.g., 'PROD')" }
      },
      required: ["product_id"]
    }
  },
  {
    name: "aha_products_list_features",
    description: "List features for a specific Aha! product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID or reference prefix" },
        page: { type: "number", description: "Page number", default: 1 },
        per_page: { type: "number", description: "Features per page (max 100)", default: 20 }
      },
      required: ["product_id"]
    }
  },
  // Features
  {
    name: "aha_features_search",
    description: "Search for Aha! features by query",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        product_id: { type: "string", description: "Optional: Filter by product ID" }
      },
      required: ["query"]
    }
  },
  {
    name: "aha_features_get_details",
    description: "Get detailed information about a specific Aha! feature including description, requirements, and Jira integration",
    inputSchema: {
      type: "object",
      properties: {
        feature_id: { type: "string", description: "Feature reference number (e.g., 'PROD-123')" }
      },
      required: ["feature_id"]
    }
  },
  // Ideas
  {
    name: "aha_ideas_list",
    description: "List ideas from Aha!",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Optional: Filter by product ID" },
        page: { type: "number", description: "Page number", default: 1 },
        per_page: { type: "number", description: "Ideas per page", default: 20 }
      },
      required: []
    }
  },
  {
    name: "aha_ideas_get_details",
    description: "Get detailed information about a specific Aha! idea",
    inputSchema: {
      type: "object",
      properties: {
        idea_id: { type: "string", description: "Idea reference number (e.g., 'PROD-I-123')" }
      },
      required: ["idea_id"]
    }
  },
  {
    name: "aha_ideas_search",
    description: "Search for ideas in Aha! by keyword",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        product_id: { type: "string", description: "Optional: Filter by product ID" }
      },
      required: ["query"]
    }
  },
  // Initiatives
  {
    name: "aha_initiatives_list",
    description: "List initiatives from Aha!",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Optional: Filter by product ID" }
      },
      required: []
    }
  },
  {
    name: "aha_initiatives_get_details",
    description: "Get detailed information about a specific Aha! initiative",
    inputSchema: {
      type: "object",
      properties: {
        initiative_id: { type: "string", description: "Initiative reference number" }
      },
      required: ["initiative_id"]
    }
  },
  // Launches
  {
    name: "aha_launches_list",
    description: "List launches/releases from Aha!",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Optional: Filter by product ID" }
      },
      required: []
    }
  },
  // Workflows
  {
    name: "aha_workflows_list",
    description: "List workflow statuses for a product",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Product ID or reference prefix" }
      },
      required: ["product_id"]
    }
  },
  // OKRs
  {
    name: "aha_company_okrs_list",
    description: "List company-level OKRs from Aha!",
    inputSchema: {
      type: "object",
      properties: {
        time_frame: { type: "string", description: "Optional: Filter by time frame (e.g., 'Q1 2024')" }
      },
      required: []
    }
  },
  {
    name: "aha_team_okrs_list",
    description: "List team OKRs from Aha!",
    inputSchema: {
      type: "object",
      properties: {
        product_id: { type: "string", description: "Optional: Filter by product/team ID" }
      },
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
      // Products
      case "aha_products_list": {
        const data = await fetchFromAha('products');
        const products = data.products || [];
        if (products.length === 0) return "No products found in Aha!.";
        return `Found ${products.length} products:\n\n` + products.map(p => 
          `**${p.reference_prefix}: ${p.name}**\n${p.description || 'No description'}\nFeatures: ${p.features_count || 0} | Ideas: ${p.ideas_count || 0}`
        ).join('\n\n---\n\n');
      }

      case "aha_products_get_details": {
        const data = await fetchFromAha(`products/${args.product_id}`);
        const p = data.product;
        if (!p) return `Product ${args.product_id} not found.`;
        return `**${p.reference_prefix}: ${p.name}**\n\n${p.description || 'No description'}\n\n**Stats:**\n- Initiatives: ${p.initiatives_count || 0}\n- Features: ${p.features_count || 0}\n- Ideas: ${p.ideas_count || 0}\n- Created: ${new Date(p.created_at).toLocaleDateString()}`;
      }

      case "aha_products_list_features": {
        const page = args.page || 1;
        const perPage = Math.min(args.per_page || 20, 100);
        const data = await fetchFromAha(`products/${args.product_id}/features?page=${page}&per_page=${perPage}`);
        const features = data.features || [];
        if (features.length === 0) return `No features found for ${args.product_id}.`;
        return `Found ${features.length} features:\n\n` + features.map(f => 
          `**${f.reference_num}: ${f.name}**\nStatus: ${f.workflow_status?.name || 'Unknown'} | Release: ${f.release?.name || 'Unscheduled'}`
        ).join('\n\n---\n\n');
      }

      // Features
      case "aha_features_search": {
        let endpoint = `features?q=${encodeURIComponent(args.query)}`;
        if (args.product_id) endpoint = `products/${args.product_id}/features?q=${encodeURIComponent(args.query)}`;
        const data = await fetchFromAha(endpoint);
        const features = data.features || [];
        if (features.length === 0) return `No features found for "${args.query}".`;
        return `Found ${features.length} features:\n\n` + features.map(f => 
          `**${f.reference_num}: ${f.name}**\nStatus: ${f.workflow_status?.name || 'Unknown'} | Release: ${f.release?.name || 'Unscheduled'}`
        ).join('\n\n---\n\n');
      }

      case "aha_features_get_details": {
        const data = await fetchFromAha(`features/${args.feature_id}`);
        const f = data.feature;
        if (!f) return `Feature ${args.feature_id} not found.`;
        
        let result = `**${f.reference_num}: ${f.name}**\n\n`;
        result += `**Status:** ${f.workflow_status?.name || 'Unknown'}\n`;
        result += `**Release:** ${f.release?.name || 'Unscheduled'}\n`;
        result += `**Assignee:** ${f.assigned_to_user?.name || 'Unassigned'}\n\n`;
        
        if (f.description?.body) {
          result += `**Description:**\n${f.description.body}\n\n`;
        }
        
        // Check for Jira integration
        if (f.integration_fields && f.integration_fields.length > 0) {
          const jiraFields = f.integration_fields.filter(field => field.service_name === 'jira');
          if (jiraFields.length > 0) {
            result += `**Jira Integration:**\n`;
            const keyField = jiraFields.find(field => field.name === 'key');
            const urlField = jiraFields.find(field => field.name === 'url');
            if (keyField) result += `- Epic Key: ${keyField.value}\n`;
            if (urlField) result += `- URL: ${urlField.value}\n`;
          }
        }
        
        return result;
      }

      // Ideas
      case "aha_ideas_list": {
        let endpoint = 'ideas';
        if (args.product_id) endpoint = `products/${args.product_id}/ideas`;
        const page = args.page || 1;
        const perPage = args.per_page || 20;
        const data = await fetchFromAha(`${endpoint}?page=${page}&per_page=${perPage}`);
        const ideas = data.ideas || [];
        if (ideas.length === 0) return "No ideas found.";
        return `Found ${ideas.length} ideas:\n\n` + ideas.map(i => 
          `**${i.reference_num}: ${i.name}**\nStatus: ${i.workflow_status?.name || 'Unknown'} | Votes: ${i.votes_count || 0}`
        ).join('\n\n---\n\n');
      }

      case "aha_ideas_get_details": {
        const data = await fetchFromAha(`ideas/${args.idea_id}`);
        const i = data.idea;
        if (!i) return `Idea ${args.idea_id} not found.`;
        return `**${i.reference_num}: ${i.name}**\n\nStatus: ${i.workflow_status?.name || 'Unknown'}\nVotes: ${i.votes_count || 0}\nCreated: ${new Date(i.created_at).toLocaleDateString()}\n\n${i.description?.body || 'No description'}`;
      }

      case "aha_ideas_search": {
        let endpoint = `ideas?q=${encodeURIComponent(args.query)}`;
        if (args.product_id) endpoint = `products/${args.product_id}/ideas?q=${encodeURIComponent(args.query)}`;
        const data = await fetchFromAha(endpoint);
        const ideas = data.ideas || [];
        if (ideas.length === 0) return `No ideas found for "${args.query}".`;
        return `Found ${ideas.length} ideas:\n\n` + ideas.map(i => 
          `**${i.reference_num}: ${i.name}**\nStatus: ${i.workflow_status?.name || 'Unknown'} | Votes: ${i.votes_count || 0}\n${i.description?.body?.substring(0, 200) || 'No description'}...`
        ).join('\n\n---\n\n');
      }

      // Initiatives
      case "aha_initiatives_list": {
        let endpoint = 'initiatives';
        if (args.product_id) endpoint = `products/${args.product_id}/initiatives`;
        const data = await fetchFromAha(endpoint);
        const initiatives = data.initiatives || [];
        if (initiatives.length === 0) return "No initiatives found.";
        return `Found ${initiatives.length} initiatives:\n\n` + initiatives.map(i => 
          `**${i.reference_num}: ${i.name}**\nStatus: ${i.workflow_status?.name || 'Unknown'}`
        ).join('\n\n---\n\n');
      }

      case "aha_initiatives_get_details": {
        const data = await fetchFromAha(`initiatives/${args.initiative_id}`);
        const i = data.initiative;
        if (!i) return `Initiative ${args.initiative_id} not found.`;
        return `**${i.reference_num}: ${i.name}**\n\nStatus: ${i.workflow_status?.name || 'Unknown'}\n\n${i.description?.body || 'No description'}`;
      }

      // Launches
      case "aha_launches_list": {
        let endpoint = 'releases';
        if (args.product_id) endpoint = `products/${args.product_id}/releases`;
        const data = await fetchFromAha(endpoint);
        const releases = data.releases || [];
        if (releases.length === 0) return "No releases/launches found.";
        return `Found ${releases.length} releases:\n\n` + releases.map(r => 
          `**${r.reference_num}: ${r.name}**\nStart: ${r.start_date || 'TBD'} | Release: ${r.release_date || 'TBD'}`
        ).join('\n\n---\n\n');
      }

      // Workflows
      case "aha_workflows_list": {
        const data = await fetchFromAha(`products/${args.product_id}/workflow_statuses`);
        const statuses = data.workflow_statuses || [];
        if (statuses.length === 0) return `No workflow statuses found for ${args.product_id}.`;
        return `Workflow statuses for ${args.product_id}:\n\n` + statuses.map(s => 
          `- **${s.name}** (${s.category || 'N/A'})`
        ).join('\n');
      }

      // OKRs
      case "aha_company_okrs_list": {
        let endpoint = 'goals';
        if (args.time_frame) endpoint += `?time_frame=${encodeURIComponent(args.time_frame)}`;
        const data = await fetchFromAha(endpoint);
        const goals = data.goals || [];
        if (goals.length === 0) return "No company OKRs found.";
        return `Found ${goals.length} company OKRs:\n\n` + goals.map(g => 
          `**${g.reference_num}: ${g.name}**\nProgress: ${g.progress || 0}%`
        ).join('\n\n---\n\n');
      }

      case "aha_team_okrs_list": {
        let endpoint = 'goals';
        if (args.product_id) endpoint = `products/${args.product_id}/goals`;
        const data = await fetchFromAha(endpoint);
        const goals = data.goals || [];
        if (goals.length === 0) return "No team OKRs found.";
        return `Found ${goals.length} team OKRs:\n\n` + goals.map(g => 
          `**${g.reference_num}: ${g.name}**\nProgress: ${g.progress || 0}%`
        ).join('\n\n---\n\n');
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
  { name: "aha-tools", version: "1.0.0" },
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
  console.error("Aha! MCP server running on stdio");
}

main().catch(console.error);

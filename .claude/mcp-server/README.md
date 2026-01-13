# OpenGov MCP Servers

This directory contains Model Context Protocol (MCP) servers that provide Claude CLI with access to external tools and services.

## Aha! MCP Server

The `aha-server.mjs` file provides Claude with access to Aha! product management data:

### Available Tools

| Tool | Description |
|------|-------------|
| `aha_products_list` | List all products |
| `aha_products_get_details` | Get product details |
| `aha_products_list_features` | List features for a product |
| `aha_features_search` | Search for features |
| `aha_features_get_details` | Get feature details with Jira integration |
| `aha_ideas_list` | List ideas |
| `aha_ideas_get_details` | Get idea details |
| `aha_ideas_search` | Search for ideas |
| `aha_initiatives_list` | List initiatives |
| `aha_initiatives_get_details` | Get initiative details |
| `aha_launches_list` | List releases/launches |
| `aha_workflows_list` | List workflow statuses |
| `aha_company_okrs_list` | List company-level OKRs |
| `aha_team_okrs_list` | List team OKRs |

### Environment Variables

Required environment variables:
- `AHA_SUBDOMAIN` - Your Aha! subdomain (e.g., `opengov` for `opengov.aha.io`)
- `AHA_API_TOKEN` - Your Aha! API token

### Setup

```bash
claude mcp add "aha-tools" -- node /path/to/.claude/mcp-server/aha-server.mjs
```

---

## Ask Product GPT MCP Server

The `ask-product-gpt-server.mjs` file provides Claude with access to OpenGov product expert assistants powered by OpenAI:

### Available Tools

| Tool | Description |
|------|-------------|
| `ask_product_expert` | Ask a product-specific expert about OpenGov products |
| `list_product_experts` | List all available product expert assistants |

### Available Product Experts

| Code | Product |
|------|---------|
| `FIN` | Financials |
| `GAB` | Government App Builder |
| `BP` | Budgeting & Performance |
| `PRO` | Procurement & Contract Management |
| `EAM` | Enterprise Asset Management |
| `PLC` | Permitting & Licensing |

### Environment Variables

Required environment variables:
- `OPENAI_API_KEY_MAIN` - OpenAI API key for FIN, GAB, BP, PRO, EAM products
- `OPENAI_API_KEY_PLC` - OpenAI API key for PLC product

### Setup

```bash
claude mcp add "ask-product-gpt" -- node /path/to/.claude/mcp-server/ask-product-gpt-server.mjs
```

---

## OG Product Strategy MCP Server (Remote)

This is a remote MCP server hosted at `https://og-product-hub.vercel.app/mcp` that provides product strategy and PMF (Product-Market Fit) dashboard tools.

### Configuration

This server is configured in `.claude/settings.json` as a remote MCP server:

```json
{
  "mcpServers": {
    "og-product-strategy": {
      "type": "remote",
      "url": "https://og-product-hub.vercel.app/mcp",
      "enabled": true,
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:PMF_API_KEY}"
      },
      "timeout": 10000
    }
  }
}
```

### Environment Variables

Required environment variables:
- `PMF_API_KEY` - API key for the OG Product Hub

---

## Installation

```bash
# Install dependencies (required for local MCP servers)
npm install
```

The local MCP servers are automatically registered with Claude CLI when the appropriate credentials are provided. They work via stdio transport.

The remote MCP server (og-product-strategy) is configured in `.claude/settings.json` and connects via HTTP.

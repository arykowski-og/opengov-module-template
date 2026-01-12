---
name: aha-workflows
description: Query Aha! workflow and status definitions. Use when asked about available statuses, workflow configurations, status values for features/launches/initiatives, or comparing workflows across products.
---

# Aha! Workflows (Status Definitions)

## Overview

This skill enables querying workflow definitions from Aha!. Workflows define the available statuses for different record types (features, initiatives, launches, etc.) in each product. Each product can have different workflows and statuses.

## Environment Requirements

- `AHA_SUBDOMAIN` - Your Aha! instance subdomain
- `AHA_API_TOKEN` - API token for authentication

## OpenGov Terminology Mapping

When querying workflows, remember the terminology mapping:

| OpenGov Term | Aha! API Term |
|--------------|---------------|
| Launch | Initiative |
| Initiative | Epic |
| Feature | Feature |

The tools accept **both** OpenGov terms ("launch", "initiative") and Aha! API terms.

## Available Tools

| Tool | Description |
|------|-------------|
| `list_by_product` | List all workflows for a product |
| `get_details` | Get detailed workflow information by ID |
| `list_statuses_for_type` | List statuses for a specific record type in a product |
| `compare_workflows` | Compare workflows across multiple products |

## Common Patterns

### List All Workflows for a Product
```
aha-workflows.list_by_product(product_id: "TAX")
```

### Get Statuses for Features
```
aha-workflows.list_statuses_for_type(product_id: "TAX", record_type: "feature")
```

### Get Statuses for Launches
```
// Using OpenGov term
aha-workflows.list_statuses_for_type(product_id: "TAX", record_type: "launch")
// Using Aha! API term
aha-workflows.list_statuses_for_type(product_id: "TAX", record_type: "initiative")
```

### Compare Workflows Across Products
```
aha-workflows.compare_workflows(
  product_ids: ["TAX", "PLC", "FIN"],
  record_type: "feature"
)
```

## Response Structure

### Workflows include:
- Workflow name and record type
- Active/inactive status
- Default workflow indicator
- List of statuses in order

### Statuses include:
- Status name
- Position (order in workflow)
- Complete flag (✓ marks work as done)
- Color for visual identification

## Key Concepts

### Record Types
Workflows are defined per record type:
- **Feature** - Individual feature items
- **Initiative** (Aha!) / **Launch** (OpenGov) - Major releases
- **Epic** (Aha!) / **Initiative** (OpenGov) - Strategic work items
- **Release** - Release containers
- **Requirement** - Feature requirements
- **Goal** - Strategic goals

### Complete Statuses
Statuses marked as "complete" (✓) indicate:
- Work is finished
- Affects reporting and dashboards
- Typically statuses like "Done", "Shipped", "Released"

### Default Workflows
Products can have multiple workflows per record type, but one is marked as default for new items.

## Tips

1. Use exact status names when creating/updating records via API
2. Complete statuses affect progress calculations
3. Compare workflows to identify standardization opportunities
4. Product prefixes like "TAX", "PLC", "FIN" work as product IDs

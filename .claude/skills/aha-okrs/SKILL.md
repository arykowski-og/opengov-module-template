---
name: aha-okrs
description: Query and understand company and team OKRs (Objectives and Key Results) from Aha!. Use when asked about OKRs, strategic objectives, quarterly goals, R&D priorities, company objectives, team goals, or key results progress.
---

# Aha! OKRs (Objectives and Key Results)

## Overview

This skill enables querying OKRs from Aha! at both company (R&D) and team levels. OKRs are strategic goal-tracking structures used at OpenGov for alignment.

## Environment Requirements

- `AHA_SUBDOMAIN` - Your Aha! instance subdomain
- `AHA_API_TOKEN` - API token for authentication

## Key Concepts

### Company OKRs (R&D Level)
- Located in the top-level "OG" workspace
- Track overall R&D/company strategic objectives
- **Key Results are Initiatives** (unique to company level)
- Use `aha-company-okrs` tools

### Team OKRs (Product Level)
- Located in product/workspace level (e.g., TAX, PLC, FIN)
- Align team work with company objectives
- Key Results have metrics (starting, current, target)
- May link to parent company goals
- Use `aha-team-okrs` tools

## Available Tools

### Company OKRs (`aha-company-okrs`)

| Tool | Description |
|------|-------------|
| `get` | Get company/R&D OKRs for a time frame (defaults to current quarter) |
| `get_by_goal` | Get details for a specific company goal by reference number |

### Team OKRs (`aha-team-okrs`)

| Tool | Description |
|------|-------------|
| `get` | Get team OKRs for a specific product (REQUIRED: product_id) |
| `list_products` | List available products/workspaces that have team OKRs |

## Common Patterns

### Get Current Quarter Company OKRs
```
aha-company-okrs.get()
// Automatically defaults to current quarter
```

### Get Team OKRs for a Product
```
aha-team-okrs.get(product_id: "TAX")
aha-team-okrs.get(product_id: "PLC", time_frame: "Q1 2025")
```

### Find Available Products
```
aha-team-okrs.list_products()
```

## Time Frame Formats

The tools accept various time frame formats:
- `Q1 2025`, `2025 Q1`
- `Q4'25`
- `2025-Q4`
- If not specified, defaults to **current quarter**

## Response Structure

### Company OKRs include:
- Objective name, reference number, progress
- Time frame and success metrics
- Key Results (Initiatives) with status, owner, and progress

### Team OKRs include:
- Objective name, progress, linked company goal
- Key Results with metrics (starting → current → target)
- Completion rate and summary statistics

## Tips

1. **Start with `list_products`** to see available team workspaces
2. Company OKRs use Initiatives as Key Results (OpenGov-specific)
3. Team goals may link to parent company goals for alignment tracking
4. Progress percentages indicate completion toward objectives

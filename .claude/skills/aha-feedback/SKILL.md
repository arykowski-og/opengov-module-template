---
name: aha-feedback
description: Query customer feedback and feature requests from Aha! Ideas. Use when asked about customer ideas, feature requests, feedback, promoted features, idea scores, or customer organizations.
---

# Aha! Ideas (Customer Feedback)

## Overview

This skill enables querying customer feedback and feature requests from Aha! Ideas portal. Ideas represent customer-submitted suggestions that can be scored, categorized, and potentially promoted to features.

## Environment Requirements

- `AHA_SUBDOMAIN` - Your Aha! instance subdomain
- `AHA_API_TOKEN` - API token for authentication

## Available Tools

### Ideas (`aha-ideas`)

| Tool | Description |
|------|-------------|
| `list` | List ideas with optional product filter |
| `search` | Search ideas by keyword |
| `get_details` | Get detailed information about a specific idea |
| `list_organizations` | List customer organizations with ARR/priority data |

## Common Patterns

### List Ideas for a Product
```
aha-ideas.list(product_id: "FIN")
aha-ideas.list(product_id: "FIN", page: 2, per_page: 50)
```

### Search for Ideas
```
aha-ideas.search(query: "reporting", product_id: "TAX")
```

### Get Idea Details
```
aha-ideas.get_details(idea_id: "FIN-I-123")
```

### List Customer Organizations
```
aha-ideas.list_organizations(per_page: 50)
```

## Response Structure

### Ideas include:
- Reference number and name
- Description (HTML stripped for readability)
- Score (for prioritization)
- Categories and tags
- Workflow status
- Vote and comment counts
- Promoted status (⭐ if promoted to feature)
- Created by user

### Organizations include:
- Organization name and reference
- ARR (Annual Recurring Revenue)
- Customer tier
- User count

## Key Concepts

### Idea Scoring
Ideas have scores that help prioritize which customer requests to implement. Higher scores typically indicate higher priority.

### Promoted Ideas
When an idea is promoted, it becomes a feature in the roadmap. Promoted ideas are marked with ⭐.

### Categories & Tags
Ideas are organized by:
- **Categories**: Product areas or themes
- **Tags**: Custom labels for filtering

## Tips

1. Use `search` to find ideas related to specific functionality
2. Check `promoted` status to see what's already planned
3. `list_organizations` helps understand customer context and ARR impact
4. Scores help prioritize feature requests objectively

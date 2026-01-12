---
name: aha-roadmap
description: Query Aha! roadmap data including launches, initiatives, features, and products. Use when asked about product roadmaps, releases, launches, features, initiatives, epics, strategic work items, or delivery timelines.
---

# Aha! Roadmap Tools

## Overview

This skill enables querying Aha! for roadmap-related data: launches (major releases), initiatives (strategic work items), features, and products.

## Environment Requirements

- `AHA_SUBDOMAIN` - Your Aha! instance subdomain
- `AHA_API_TOKEN` - API token for authentication

## OpenGov Terminology Mapping

⚠️ **Important:** OpenGov uses different terminology than Aha! API:

| OpenGov Term | Aha! API Term | Tool |
|--------------|---------------|------|
| **Launch** | Initiative | `aha-launches` |
| **Initiative** | Epic | `aha-initiatives` |
| Feature | Feature | `aha-features` |

## Launch Tiers (OpenGov)

- **Tier 1**: Major release with hype video + one-pager (new product/functionality, market expansion)
- **Tier 2**: Product updates that generate buzz (no video/one-pager)
- **Tier 3**: Bug fixes, maintenance, small UI/UX updates

## Available Tools

### Launches (`aha-launches`)

| Tool | Description |
|------|-------------|
| `list` | List launches with optional product filter |
| `get_details` | Get launch details including features |
| `list_features` | List features in a specific launch |
| `list_by_goal` | List launches supporting a company goal |

### Initiatives (`aha-initiatives`)

| Tool | Description |
|------|-------------|
| `list` | List initiatives with optional filtering |
| `list_by_product` | List initiatives for a specific product |
| `list_by_launch` | List initiatives under a specific launch |
| `get_details` | Get initiative details including features |
| `list_features` | List features in an initiative |

### Features (`aha-features`)

| Tool | Description |
|------|-------------|
| `list` | List features with product/release filtering |
| `get_details` | Get feature details including linked initiatives |
| `search` | Search features by keyword |
| `compare_with_initiatives` | Analyze roadmap alignment |
| `list_by_release` | List features grouped by release |
| `get_initiative` | Get initiative (launch) details |
| `list_features_by_initiative` | List features in an initiative |

### Products (`aha-products`)

| Tool | Description |
|------|-------------|
| `list` | List all products |
| `get_details` | Get product details |
| `list_features` | List features for a product |

## Common Patterns

### Get Active Launches
```
aha-launches.list(only_active: true)
aha-launches.list(product_id: "TAX", only_active: true)
```

### Get Launch Details with Features
```
aha-launches.get_details(launch_id: "TAX-I-123", include_features: true)
```

### See What Supports a Goal
```
aha-launches.list_by_goal(goal_id: "OG-G-1")
```

### Get Initiatives in a Launch
```
aha-initiatives.list_by_launch(launch_id: "TAX-I-123")
```

### Search Features
```
aha-features.search(query: "invoice", product_id: "FIN")
```

### Roadmap Analysis
```
aha-features.compare_with_initiatives(product_id: "TAX")
```

## Response Structure

### Launches include:
- Reference number, name, description
- Launch tier and design partners
- Progress, status, owner
- Timeline (start/end dates)
- Linked goals and features

### Initiatives include:
- Reference number, name, description
- Parent launch (if applicable)
- Progress, status, owner
- Release and timeline
- Feature count

### Features include:
- Reference number, name, description
- Workflow status and progress
- Release assignment
- Linked initiative (launch)
- Tags and assignee

## Tips

1. **Use product prefixes** like "TAX", "PLC", "FIN" when filtering
2. Launch tiers help prioritize communication and marketing
3. Design partners indicate customer involvement
4. Features can be analyzed across releases for planning

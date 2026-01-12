# Seamstress Application Skills

Local skills for rapid application prototyping with OpenGov Capital Design System.

## Skills Inventory (14 total)

### Core (1 skill)
- `seamstress-core-principles` - Page-level golden rules, validation checklist, Seamstress-specific theme overrides

### Domain (4 skills)
- `seamstress-architecture` - Project structure, active packages, architectural decisions
- `seamstress-business-logic` - Effect.ts patterns, data fetching
- `seamstress-figma-layout-detection` - Auto-detect NavBar, generate suite layouts
- `seamstress-routing-patterns` - Entity-scoped routing (`/entity/${entityId}/resource`)

### Patterns (4 skills)
- `dashboard-pattern` - Metrics dashboards with cards
- `detail-view-pattern` - Read-only detail pages
- `form-pattern` - Create/edit forms with validation
- `list-view-pattern` - DataGrid lists with search, filters, pagination

### Product Management (6 skills)
- `aha-okrs` - Company and team OKRs from Aha! (`aha-company-okrs`, `aha-team-okrs`)
- `aha-roadmap` - Launches, initiatives, features, products (`aha-launches`, `aha-initiatives`, `aha-features`, `aha-products`)
- `aha-feedback` - Customer ideas and feedback (`aha-ideas`)
- `aha-workflows` - Status and workflow definitions (`aha-workflows`)
- `product-experts` - Product-specific AI assistants (`ask-product-gpt`)
- `jira` - Issues and work items (`jira-issue`)

See [product-management/README.md](./product-management/README.md) for environment requirements and usage.

## Removed Skills (now in external plugin)

The following skills have been removed to eliminate redundancy with external plugin skills:

- **seamstress-accessibility** → Use external `validate-capital` skill for WCAG 2.1 AA compliance
- **seamstress-theme-system** → Content consolidated into `seamstress-core-principles`; use external `design-tokens-guide` and `mui-theme-guide` for detailed theme guidance
- **seamstress-component-hierarchy** → Use external `component-patterns` for Composable + Configurable architecture

## Usage

Skills are automatically discovered and invoked by Claude based on your request:

```
"Build a skills list page" → list-view-pattern + core-principles + routing-patterns
"Create an agent form" → form-pattern + core-principles + business-logic
"Generate a dashboard" → dashboard-pattern + core-principles
```

## External Plugin Skills

For component package development and foundational guidance, reference external plugin skills:

**Component Development:**
- `component-detector` - Detect OpenGov packages from Figma
- `component-patterns` - Composable + Configurable architecture
- `figma-to-code` - Generate components from Figma designs

**Design System:**
- `design-tokens-guide` - Raw token access (JS/TS, CSS/SCSS)
- `mui-theme-guide` - MUI theme usage for React components
- `token-mapper` - Map Figma values to tokens
- `layout-patterns` - Common MUI layout patterns

**Validation:**
- `validate-capital` - Comprehensive compliance validation, accessibility checks

## Component Development

For reusable component packages, use marketplace commands:
- `/seamstress-build` - Generate from Figma
- `/seamstress-validate` - Validate package
- `/seamstress-stories` - Create Storybook stories

Marketplace skills automatically available after installation:
```bash
# Add to .claude/settings.json (already configured)
# Skills are auto-invoked, no manual setup needed
```

## Testing

See `.claude/SKILLS_TEST_SUITE.md` for validation tests.

Quick validation:
1. Ask: "What are Seamstress golden rules?" (should cite core-principles)
2. Ask: "Generate a skills list page" (should follow all principles)

## Documentation

- **Main README**: `.claude/README.md`
- **Test Suite**: `.claude/SKILLS_TEST_SUITE.md`
- **Architecture Analysis**: `.claude/ARCHITECTURE_ANALYSIS.md`
- **Skills Audit**: `SEAMSTRESS_SKILLS_AUDIT.md`

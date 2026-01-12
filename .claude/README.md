# Seamstress Application Development

This project uses **Seamstress skills for application prototyping** - rapidly building React pages for Agent Studio, Seamstress UI, and prototypes.

## What's Available

### From Marketplace (Automatic)

The OpenGov Component Library marketplace provides component development tools:
- **Commands:** `/seamstress-build`, `/seamstress-stories`, `/seamstress-validate`, `/seamstress-debug`, `/seamstress-tokens`, `/seamstress-refactor`
- **Skills:** Auto-invoked for component package development (7 total: 5 component generation + 2 foundation)

These are globally available after one-time marketplace installation.

### Local Skills (Application Patterns)

This repo provides application-specific skills:

**Core (1 skill):**
- `seamstress-core-principles` - Page-level golden rules, validation checklist

**Domain (6 skills):**
- `seamstress-routing-patterns` - Entity-scoped routing (`/entity/${entityId}/resource`)
- `seamstress-business-logic` - Effect.ts patterns, data fetching
- `seamstress-theme-system` - Application theming, token usage
- `seamstress-figma-layout-detection` - Auto-detect NavBar, generate suite layouts
- `seamstress-architecture` - Application structure, router hierarchy
- `seamstress-accessibility` - WCAG 2.1 AA compliance

**Patterns (4 skills):**
- `list-view-pattern` - DataGrid lists with search, filters, pagination
- `form-pattern` - Create/edit forms with validation
- `detail-view-pattern` - Read-only detail pages
- `dashboard-pattern` - Metrics dashboards with cards

### Optimization (Reduced from 11 to 8 skills)

Recent optimization removed 3 redundant skills:
- **seamstress-accessibility** → Now use external `validate-capital` skill
- **seamstress-theme-system** → Content consolidated into `seamstress-core-principles`
- Trimmed **seamstress-architecture** by ~60% (removed content now in external plugin skills)

This eliminates ~55% of redundant content while preserving all unique Seamstress requirements.

---

## Usage

### Building Pages (Use Local Skills)

Just ask naturally - Claude automatically loads local skills:

```
"Build a skills list page with search and filters"
→ Loads: list-view-pattern, core-principles, routing-patterns
→ Generates: src/pages/SkillsList.tsx with DataGrid, PageHeader, entity routes

"Create a form for editing agents"
→ Loads: form-pattern, core-principles, business-logic
→ Generates: src/pages/AgentForm.tsx with validation, unsaved changes guard

"Generate a dashboard with work order metrics"
→ Loads: dashboard-pattern, core-principles
→ Generates: src/pages/Dashboard.tsx with metric cards, charts
```

### Building Components (Use Marketplace)

Use explicit commands for component packages:

```bash
/seamstress-build [figma-url]     # Build reusable component
/seamstress-validate [path]       # Validate component
/seamstress-stories [path]        # Generate Storybook stories
```

---

## Skills Discovery

Claude Code automatically discovers the right skills:

**Application Development Keywords:**
- "list", "form", "dashboard", "detail", "page", "routing", "layout"
→ Loads local application pattern skills

**Component Package Keywords:**
- "package", "composable", "configurable", "storybook", "component"
→ Loads marketplace component skills

---

## Application Features

All pages built with local skills include:

- **PageHeaderComposable** - Required on every page
- **Entity-scoped routes** - `/entity/${entityId}/resource` pattern
- **Theme tokens only** - No hardcoded colors or spacing
- **All 4 states** - Loading, error, empty, success
- **OpenGov Capital Design System** - MUI theme integration
- **Mock data generation** - For rapid prototyping

---

## Related Documentation

- **Local Skills:** `.claude/skills/README.md`
- **Marketplace:** component-library `.claude/commands/README.md`
- **Architecture Analysis:** `.claude/ARCHITECTURE_ANALYSIS.md`
- **Migration Summary:** `.claude/MIGRATION_SUMMARY.md`

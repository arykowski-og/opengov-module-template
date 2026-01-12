# Seamstress Application Skills

Local skills for rapid application prototyping with OpenGov Capital Design System.

## Skills Inventory (11 total)

### Core (1 skill)
- `seamstress-core-principles` - Page-level golden rules, validation checklist

### Domain (6 skills)
- `seamstress-routing-patterns` - Entity-scoped routing (`/entity/${entityId}/resource`)
- `seamstress-business-logic` - Effect.ts patterns, data fetching
- `seamstress-theme-system` - Application theming, token usage
- `seamstress-figma-layout-detection` - Auto-detect NavBar, generate suite layouts
- `seamstress-architecture` - Application structure, router hierarchy
- `seamstress-accessibility` - WCAG 2.1 AA compliance

### Patterns (4 skills)
- `list-view-pattern` - DataGrid lists with search, filters, pagination
- `form-pattern` - Create/edit forms with validation
- `detail-view-pattern` - Read-only detail pages
- `dashboard-pattern` - Metrics dashboards with cards

## Usage

Skills are automatically discovered and invoked by Claude based on your request:

```
"Build a skills list page" → list-view-pattern + core-principles + routing-patterns
"Create an agent form" → form-pattern + core-principles + business-logic
"Generate a dashboard" → dashboard-pattern + core-principles + theme-system
```

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
- **Migration Summary**: `.claude/MIGRATION_SUMMARY.md`

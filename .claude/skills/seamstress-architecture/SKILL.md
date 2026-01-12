---
name: seamstress-architecture
description: Seamstress project structure, active OpenGov packages, and key architectural decisions for application prototyping. Use when understanding project organization or architectural patterns.
---

# Seamstress Architecture

## Overview

Seamstress is a React application built on OpenGov's Capital Design System, demonstrating best practices for rapid application prototyping while maintaining consistency with the enterprise design system.

## Project Structure

```
src/
├── pages/            # Page-level components (routes)
│   ├── AgentsList.tsx
│   ├── SkillsList.tsx
│   ├── Dashboard.tsx
│   └── ...
│
├── components/       # Reusable UI components
│   ├── TiptapEditor.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   └── PageTransition.tsx
│
├── hooks/           # Custom React hooks
│   ├── useEntityList.ts
│   ├── useUnsavedChanges.ts
│   └── ...
│
├── services/        # Business logic and APIs
│   ├── api/        # API integration
│   ├── demo/       # Mock services
│   └── ...
│
├── theme/          # Theme customization
│   ├── theme.ts             # Main theme config
│   ├── components.ts        # Component overrides
│   └── seamstressStyles.ts  # Style utilities
│
├── types/          # TypeScript types
│   └── index.ts
│
├── utils/          # Utility functions
│   └── ...
│
└── mocks/          # Mock data generators
    └── ...

lib/opengov-packages/          # OpenGov dependencies
├── capital-mui-theme/         # Base theme
├── capital-design-tokens/     # Design tokens
├── components-ai-patterns/    # AI patterns
├── react-capital-assets/      # Icons
└── components-nav-bar/        # Navigation
```

## Active OpenGov Packages

### Priority 1: OpenGov Packages
- **capital-mui-theme**: Base theme and component styles
- **capital-design-tokens**: Design token definitions
- **components-ai-patterns**: AI assistant UI patterns (OGAssist)
- **react-capital-assets**: Icon library
- **components-nav-bar**: Navigation component

### Priority 2: MUI Packages
- **@mui/material**: Core MUI components
- **@mui/x-data-grid**: DataGrid for tables
- **@mui/icons-material**: Fallback icons

### Development Tools
- **vite**: Build tool
- **typescript**: Type safety
- **react-router-dom**: Routing
- **storybook**: Component documentation

## Component Organization

### Pages (`src/pages/`)
- Full page views (Dashboard, AgentsList, SkillsList, etc.)
- Route-level components
- Must include PageHeaderComposable
- Handle routing and data fetching
- Compose smaller components

### Components (`src/components/`)
- Reusable UI elements
- Extend Capital/MUI components when needed
- Business logic abstracted to services/hooks
- Presentational focus

### Hooks (`src/hooks/`)
- Data fetching patterns with Effect.ts
- Form state management
- Reusable stateful logic
- Cleanup with abort controllers

### Services (`src/services/`)
- API integration via Effect.ts
- Business logic
- Data transformation
- Mock/demo services for prototyping

## Key Architectural Decisions

### 1. Why Entity-Scoped Routes?
Entity-scoped routing (`/entity/${entityId}/resource`) provides:
- Clear data ownership and access control
- Multi-tenant support built-in
- Scalable architecture as app grows
- Security boundaries between tenants

### 2. Why Effect.ts for Async Operations?
Effect.ts was chosen for all async operations because it provides:
- Composable effects and better error handling
- Type-safe async operations
- Automatic resource cleanup with abort controllers
- Better testability and debugging

### 3. Why Minimal Theme Overrides?
Seamstress minimally extends Capital theme to:
- Maintain Capital Design System consistency
- Enable easier Capital theme upgrades
- Reduce long-term maintenance burden
- Ensure design system compliance

Only override what's truly application-specific (status colors, secondary backgrounds).

### 4. Why Component Hierarchy (OpenGov → MUI → Custom)?
Following this hierarchy ensures:
- Leverage Capital Design System fully
- Reduce custom code and maintenance
- Consistent user experience
- Faster development with pre-built patterns

## Related Skills

For additional architectural guidance, reference:
- `seamstress-core-principles` - Golden rules and validation
- `seamstress-routing-patterns` - Routing implementation
- `seamstress-business-logic` - Data flow patterns

For theme and component details, reference external plugin skills:
- `component-patterns` - Composable + Configurable architecture
- `design-tokens-guide` - Design token access methods
- `mui-theme-guide` - MUI theme usage

## Summary

Seamstress architecture emphasizes:
1. **Clear Structure**: Pages, components, hooks, services separation
2. **Extension over Replacement**: Build on Capital, don't rebuild
3. **Entity-Scoped**: All resources belong to an entity
4. **Type Safety**: TypeScript throughout for reliability

**Remember**: Respect the component hierarchy (OpenGov → MUI → Custom) and keep overrides minimal!

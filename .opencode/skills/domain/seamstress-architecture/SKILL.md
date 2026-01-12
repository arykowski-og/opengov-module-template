---
name: seamstress-architecture
description: System architecture, component hierarchy, project structure, and layer organization for Seamstress applications. Use when understanding overall system design or organizing code.
---

# Seamstress Architecture

## Overview

Seamstress is a React application built on top of OpenGov's Capital Design System, demonstrating best practices for extending an enterprise design system while maintaining consistency and reusability.

## Core Architecture Principles

### 1. Design System Extension
- **Base Layer**: OpenGov Capital MUI Theme provides the foundation
- **Override Layer**: Seamstress-specific customizations in `src/theme/`
- **Separation of Concerns**: Clear distinction between base and custom styles
- **Extend, don't replace**: Build upon Capital, don't reinvent

### 2. Component Architecture

```
┌─────────────────────────────────────┐
│         Application Layer           │
│         (Pages & Routes)            │
│    - Full page views                │
│    - Route-level components         │
└──────────────┬──────────────────────┘
               │ composes
┌──────────────▼──────────────────────┐
│        Component Layer              │
│    (Seamstress Components)          │
│    - Reusable UI elements           │
│    - Business logic abstracted      │
└──────────────┬──────────────────────┘
               │ uses
┌──────────────▼──────────────────────┐
│      Design System Layer            │
│   (Capital MUI Components)          │
│    - Pre-configured components      │
│    - Theme-aware styling            │
└──────────────┬──────────────────────┘
               │ built on
┌──────────────▼──────────────────────┐
│        Foundation Layer             │
│     (MUI Core & React)              │
│    - Base component APIs            │
│    - React primitives               │
└─────────────────────────────────────┘
```

## Theme Architecture & Build Process

### Build Resolution Hierarchy

The build process applies styles in a specific order, ensuring proper inheritance and override capability:

```
┌─────────────────────────────────────────┐
│  4. Seamstress Overrides                │
│     src/theme/theme.ts                  │
│     src/theme/components.ts             │
│     - Custom status colors             │
│     - App-specific overrides            │
└──────────────▲──────────────────────────┘
               │ extends
┌──────────────┴──────────────────────────┐
│  3. Capital MUI Theme                   │
│     lib/opengov-packages/               │
│     capital-mui-theme/                  │
│     - Component styles                  │
│     - Semantic mappings                 │
└──────────────▲──────────────────────────┘
               │ applies
┌──────────────┴──────────────────────────┐
│  2. Capital Design Tokens               │
│     lib/opengov-packages/               │
│     capital-design-tokens/              │
│     - Colors, typography, spacing       │
└──────────────▲──────────────────────────┘
               │ uses
┌──────────────┴──────────────────────────┐
│  1. MUI Base Components                 │
│     @mui/material                       │
│     - Raw Material-UI components        │
└─────────────────────────────────────────┘
```

### Layer Details

#### 1. MUI Base Components
- Raw Material-UI components
- Default Material Design styling
- Base component APIs (Button, TextField, etc.)

#### 2. Capital Design Tokens (`@opengov/capital-design-tokens/`)
Provides the design language:
- **Colors**: Brand, semantic, and utility colors
- **Typography**: Font sizes, weights, line heights
- **Spacing**: Consistent spacing units (8px grid)
- **Breakpoints**: Responsive design breakpoints

#### 3. Capital MUI Theme (`@opengov/capital-mui-theme/`)
Applies design tokens to MUI components:
- **Component Styles**: Pre-configured MUI component overrides
- **Semantic Mappings**: Maps design tokens to component properties
- **Accessibility**: WCAG compliance built-in
- **Patterns**: Common UI patterns and behaviors

#### 4. Seamstress Overrides (`src/theme/`)

**theme.ts** - Main theme file that extends Capital theme:
```typescript
export const theme = createTheme(capitalMuiTheme, {
  palette: seamstressPaletteOverrides,
  components: seamstressComponentOverrides,
});
```

Only adds what's specific to Seamstress:
- Custom status colors (draft, published, active, etc.)
- Secondary background color
- App-specific palette extensions

**components.ts** - Minimal component overrides:
- Button hover effects for outlined/text variants
- Chip success color styling
- ToggleButton selected state
- DataGrid header background
- Paper elevation0 border

### Design Principles
1. **Minimize Overrides**: Only override what's truly different
2. **Use Design Tokens**: Reference Capital's tokens for consistency
3. **Document Rationale**: Explain why each override exists
4. **Maintain Hierarchy**: Respect the component inheritance chain

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── TiptapEditor.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   └── PageTransition.tsx
│
├── pages/            # Page-level components (routes)
│   ├── AgentsList.tsx
│   ├── SkillsList.tsx
│   ├── Dashboard.tsx
│   └── ...
│
├── services/         # Business logic and APIs
│   ├── api/         # API integration
│   ├── demo/        # Mock services
│   └── ...
│
├── contexts/         # React contexts for state
│   ├── OGAssistContext.tsx
│   └── ThemeProvider.tsx
│
├── theme/           # Theme customization
│   ├── theme.ts    # Main theme config
│   ├── components.ts    # Component overrides
│   └── seamstressStyles.ts  # Style utilities
│
├── hooks/           # Custom React hooks
│   ├── useEntityList.ts
│   ├── useUnsavedChanges.ts
│   └── ...
│
├── types/           # TypeScript types
│   └── index.ts
│
└── utils/           # Utility functions
    └── ...

lib/opengov-packages/     # OpenGov dependencies
├── capital-mui-theme/    # ✅ ACTIVE - Base theme
├── capital-design-tokens/    # ✅ ACTIVE - Design tokens
├── components-ai-patterns/   # ✅ ACTIVE - AI patterns
├── react-capital-assets/     # ✅ ACTIVE - Icons
└── components-nav-bar/       # ✅ ACTIVE - Navigation
```

## Component Organization

### Page Components (`src/pages/`)
- Full page views (Dashboard, AgentsList, SkillsList, etc.)
- Route-level components
- Compose smaller components
- Handle routing and data fetching
- Include PageHeaderComposable

### UI Components (`src/components/`)
- Reusable UI elements
- Extend Capital/MUI components when needed
- Business logic abstracted to services/hooks
- Presentational focus

### Service Layer (`src/services/`)
- API integration via Effect.ts
- Business logic
- Data transformation
- Mock/demo services for prototyping

### Context Providers (`src/contexts/`)
- Global state management
- Theme provider wrapper
- Feature-specific contexts (OGAssist)

### Custom Hooks (`src/hooks/`)
- Data fetching patterns
- Form state management
- Reusable stateful logic
- Effect.ts integration

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (with Effect.ts)
    ↓
Service Layer (API Client)
    ↓
API Endpoint
    ↓
Response Processing
    ↓
State Update
    ↓
Component Re-render
```

## Active Packages

### OpenGov Packages (Priority 1)
- **capital-mui-theme**: Base theme and component styles
- **capital-design-tokens**: Design token definitions
- **components-ai-patterns**: AI assistant UI patterns (OGAssist)
- **react-capital-assets**: Icon library
- **components-nav-bar**: Navigation component

### MUI Packages (Priority 2)
- **@mui/material**: Core MUI components
- **@mui/x-data-grid**: DataGrid for tables
- **@mui/icons-material**: Fallback icons

### Development Tools
- **vite**: Build tool
- **typescript**: Type safety
- **react-router-dom**: Routing
- **storybook**: Component documentation
```

## Key Architectural Decisions

### 1. Why Entity-Scoped Routes?
- Clear data ownership
- Multi-tenant support
- Scalable architecture
- Security boundaries

### 2. Why Effect.ts for Async Operations?
- Better error handling
- Composable effects
- Type-safe async operations
- Resource cleanup (abort controllers)

### 3. Why Minimal Theme Overrides?
- Maintain Capital consistency
- Easier upgrades
- Less maintenance
- Design system compliance

### 4. Why Component Hierarchy (OpenGov → MUI → Custom)?
- Leverage Capital Design System
- Reduce custom code
- Consistent UX
- Faster development

## Related Skills

- `seamstress-core-principles` - For golden rules and validation
- `seamstress-component-hierarchy` - For import and component selection
- `seamstress-theme-system` - For theme layer details
- `seamstress-routing-patterns` - For navigation architecture
- `seamstress-business-logic` - For data flow patterns

## Summary

Seamstress architecture is built on four key principles:

1. **Layer Separation**: Clear boundaries between MUI, Capital, and Seamstress layers
2. **Extension over Replacement**: Build on Capital, don't rebuild
3. **Entity-Scoped**: All resources belong to an entity
4. **Type Safety**: TypeScript throughout for reliability

**Remember**: Understand the layer you're working in and respect the hierarchy!

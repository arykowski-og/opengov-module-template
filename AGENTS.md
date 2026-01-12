# OpenGov Module Template - Agent Instructions

## Overview

This is an internal-facing module template for OpenGov applications. It uses React Router 7, Vite, TypeScript, and the OpenGov Capital Design System (MUI-based).

## Tech Stack

### Frontend (This Template)
- **React 18** with TypeScript
- **React Router 7** for routing with SSR support
- **MUI (Material UI) v7** as the component library
- **OpenGov Capital Design System** (`@opengov/capital-mui-theme`, `@opengov/components-*`)
- **Vite 7** for bundling and development
- **Emotion** for CSS-in-JS styling

### Backend Services
- **Node.js + NestJS** for APIs and Workflows
- **Java + Spring Boot** for batch processing (bill runs, etc.)
- **Temporal** for workflow orchestration

### Infrastructure & Data
- **AWS EKS** - Kubernetes cluster
- **Managed PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **Kafka** - Event streaming and messaging
- **S3** - Object/file storage
- **Redshift** - Data warehouse
- **Metabase** - Analytics and reporting
- **Terraform** - Infrastructure as code

## Code Style & Conventions

### TypeScript
- Use strict TypeScript; avoid `any` types
- Export interfaces/types from components when they may be reused
- Use `type` for object shapes, `interface` for component props

### React Components
- Use functional components with hooks
- Place component props interface directly above the component
- Use named exports for components
- Keep components focused and composable

### MUI & Styling
- Use MUI's `sx` prop for component-level styling
- Use `capitalDesignTokens` from `@opengov/capital-mui-theme` for design tokens
- Prefer MUI components over custom HTML elements
- Use `Box` for layout containers

### File Organization
- Components go in `app/components/`
- Route components go in `app/routes/`
- Shared utilities go in `app/lib/` (create as needed)

## OpenGov Component Patterns

### Navigation
Use `@opengov/components-nav-bar` with `HrefLink` adapter for React Router:

```tsx
const HrefLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof RouteLink>, "to"> & { href: string }
>((props, ref) => <RouteLink {...props} ref={ref} to={props.href} />);
```

### Theme Provider
Always wrap content with `MuiProvider` which provides `capitalMuiTheme`:

```tsx
<ThemeProvider theme={capitalMuiTheme}>
  <CssBaseline />
  {children}
</ThemeProvider>
```

## React Router 7 Patterns

- Routes are defined in `app/routes.ts`
- Use `Route.LinksFunction` for link elements
- Use `Route.ErrorBoundaryProps` for error handling
- Import types from `./+types/[route-name]`

## Commands

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Important Notes

- This template requires OpenGov NPM credentials for private packages
- The Capital Design System Storybook is at: https://storybook.development.opengov.zone/capital-mui-storybook/
- Always use `enableRebrand` prop on NavBar component

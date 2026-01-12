---
description: "OpenGov Capital Design System patterns and component usage"
globs: ["**/*.tsx"]
alwaysApply: false
---

# OpenGov Capital Design System Patterns

## Theme Provider

Always wrap your application with `MuiProvider` that includes `capitalMuiTheme`:

```tsx
import { ThemeProvider, CssBaseline } from "@mui/material";
import { capitalMuiTheme } from "@opengov/capital-mui-theme";

export function MuiProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={capitalMuiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

## Design Tokens

Use `capitalDesignTokens` for colors, spacing, and other design values:

```tsx
import { capitalDesignTokens } from "@opengov/capital-mui-theme";

// Colors
capitalDesignTokens.foundations.colors.gray50
capitalDesignTokens.foundations.colors.gray100

// Use in sx prop
sx={{ bgcolor: capitalDesignTokens.foundations.colors.gray50 }}
```

## NavBar Component

Use `@opengov/components-nav-bar` with React Router adapter:

```tsx
import { NavBar, IMenuOption } from "@opengov/components-nav-bar";
import { Link as RouteLink } from "react-router";

// Create href adapter for React Router
const HrefLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<ComponentProps<typeof RouteLink>, "to"> & { href: string }
>((props, ref) => <RouteLink {...props} ref={ref} to={props.href} />);

// Use in menu options
const menuOptions: IMenuOption[] = [
  {
    label: "Home",
    id: "home",
    url: "/",
    linkComponent: HrefLink,
  },
];

// NavBar with rebrand enabled
<NavBar
  appName="My Module"
  enableRebrand
  menuOptions={menuOptions}
  // ... other props
/>
```

## Available OpenGov Components

- `@opengov/components-nav-bar` - Navigation bar
- `@opengov/components-drawer` - Slide-out drawers
- `@opengov/components-modal` - Modal dialogs
- `@opengov/components-page-header` - Page headers
- `@opengov/components-pagination` - Pagination controls
- `@opengov/components-result` - Result/status displays
- `@opengov/components-file-management` - File upload/management
- `@opengov/components-ai-patterns` - AI interaction patterns
- `@opengov/react-capital-assets` - Icon library

## Storybook Reference

Browse available components and their APIs at:
https://storybook.development.opengov.zone/capital-mui-storybook/

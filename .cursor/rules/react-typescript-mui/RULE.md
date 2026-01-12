---
description: "React + TypeScript + MUI coding standards for OpenGov frontend applications"
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: false
---

# React + TypeScript + MUI Standards

## TypeScript

- Use strict TypeScript with no `any` types
- Define explicit return types for functions that aren't immediately obvious
- Use `interface` for component props, `type` for other type aliases
- Export types/interfaces that may be reused by other components

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Avoid
const handleClick = (data: any) => { ... }
```

## React Components

- Use functional components with hooks exclusively
- Place props interface directly above the component definition
- Use named exports for components
- Destructure props in function parameters

```tsx
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return (
    <Box>
      <Typography variant="h1">{title}</Typography>
      {children}
    </Box>
  );
}
```

## MUI Styling

- Use the `sx` prop for component-level styling
- Use `capitalDesignTokens` for consistent design tokens
- Prefer MUI components over raw HTML elements
- Use `Box` for layout containers

```tsx
import { capitalDesignTokens } from "@opengov/capital-mui-theme";

<Box
  sx={{
    padding: 2,
    backgroundColor: capitalDesignTokens.foundations.colors.gray50,
    borderRadius: 1,
  }}
>
  {content}
</Box>
```

## Imports Order

1. React and React-related imports
2. Third-party libraries (MUI, etc.)
3. OpenGov packages
4. Local components and utilities
5. Types (if separate)

## Hooks

- Custom hooks should start with `use` prefix
- Keep hooks focused on a single responsibility
- Extract complex logic into custom hooks

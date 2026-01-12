---
name: seamstress-theme-system
description: Theme customization, design tokens, and styling patterns for Seamstress. Use theme tokens from Capital Design System, minimal overrides, and proper theme extension. Use when customizing styles or working with colors and spacing.
---

# Seamstress Theme System

## Theme Architecture

### Build Resolution Hierarchy

```
MUI Components (base)
  ↓ applies
Capital Design Tokens (lib/opengov-packages/capital-design-tokens/)
  ↓ applies
Capital MUI Theme (lib/opengov-packages/capital-mui-theme/)
  ↓ extends
Seamstress Overrides (src/theme/theme.ts, src/theme/components.ts)
  ↓ validates against
Figma Design (final check)
  ↓
Final Rendered Component
```

## Design Philosophy

- **Extend, don't replace** - Build on Capital's foundation
- **Minimal overrides** - Only customize what's truly different
- **Document rationale** - Explain why each override exists
- **Use design tokens** - No hardcoded values ever

## Theme Tokens

### Colors
```typescript
// Primary brand colors
'primary.main'              // Brand primary
'primary.light'             // Lighter variant
'primary.dark'              // Darker variant
'primary.contrastText'      // Text on primary

// Semantic colors
'error.main'                // Error states
'warning.main'              // Warnings
'info.main'                 // Informational
'success.main'              // Success states

// Text colors
'text.primary'              // Primary text
'text.secondary'            // Secondary text
'text.disabled'             // Disabled text

// Background colors
'background.default'        // Page background
'background.paper'          // Component background
'background.secondary'      // Secondary bg (Seamstress custom)

// Dividers and borders
'divider'                   // Border color
```

### Spacing (8px base unit)
```typescript
// Theme spacing function: theme.spacing(n) = n * 8px
p: 0.5   // 4px
p: 1     // 8px
p: 2     // 16px
p: 3     // 24px
p: 4     // 32px
p: 5     // 40px
p: 6     // 48px
p: 8     // 64px

// Directional spacing
pt: 2    // padding-top: 16px
pb: 2    // padding-bottom: 16px
pl: 2    // padding-left: 16px
pr: 2    // padding-right: 16px
px: 2    // padding horizontal (left + right): 16px each
py: 2    // padding vertical (top + bottom): 16px each

// Margin (same pattern)
m: 2, mt: 2, mb: 2, ml: 2, mr: 2, mx: 2, my: 2

// Gap (for flexbox/grid)
gap: 2   // 16px gap between items
```

### Typography
```typescript
<Typography variant="h1">       // Largest heading
<Typography variant="h2">       // Section heading
<Typography variant="h3">       // Subsection heading
<Typography variant="h4">       // Minor heading
<Typography variant="h5">       // Small heading
<Typography variant="h6">       // Smallest heading
<Typography variant="body1">    // Default body text
<Typography variant="body2">    // Small body text
<Typography variant="caption">  // Captions, labels
<Typography variant="button">   // Button text
<Typography variant="overline"> // Overline text
```

## Customization Strategy

### ✅ DO: Extend Existing Palette
```typescript
// GOOD: Extend Capital theme
const seamstressPaletteOverrides = {
  ...capitalMuiTheme.palette,
  status: {
    draft: capitalDesignTokens.foundations.colors.gray300,
    published: capitalDesignTokens.foundations.colors.green700,
    active: capitalDesignTokens.foundations.colors.green600,
  }
};

export const theme = createTheme(capitalMuiTheme, {
  palette: seamstressPaletteOverrides,
  components: seamstressComponentOverrides,
});
```

### ❌ DON'T: Duplicate Base Styles
```typescript
// BAD: Redefining what Capital already provides
MuiButton: {
  styleOverrides: {
    root: {
      textTransform: 'none', // Capital already does this
      fontWeight: 500,       // Capital already sets this
    }
  }
}
```

## Using Theme in Components

### Via useTheme Hook
```typescript
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();

  return (
    <Box sx={{
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      padding: theme.spacing(2),
    }}>
      Content
    </Box>
  );
}
```

### Via sx Prop (Recommended)
```typescript
// Direct theme references in sx prop
<Box sx={{
  backgroundColor: 'background.paper',
  color: 'text.primary',
  p: 2,
  border: 1,
  borderColor: 'divider',
  borderRadius: 1,
}}>
  Content
</Box>
```

## Component Overrides

### When to Add Overrides
Only add component overrides when:
1. Capital doesn't provide the styling you need
2. It's truly specific to Seamstress
3. You've checked Figma and confirmed it's intentional

### Component Override Pattern
```typescript
// In components.ts
export const seamstressComponentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        // Only Seamstress-specific customizations
        '&.seamstress-special': {
          // Custom styling
        }
      }
    }
  }
};
```

## Responsive Design

### Breakpoints
```typescript
xs: 0px      // Extra small (mobile)
sm: 600px    // Small (tablet)
md: 900px    // Medium (small laptop)
lg: 1200px   // Large (desktop)
xl: 1536px   // Extra large

// Usage in sx prop
sx={{
  display: { xs: 'none', md: 'block' },    // Hidden on mobile, shown on desktop
  width: { xs: '100%', md: 400 },          // Full width mobile, 400px desktop
  fontSize: { xs: 14, md: 16 },            // 14px mobile, 16px desktop
  p: { xs: 1, sm: 2, md: 3 }              // Responsive padding
}}
```

## Component Heights

### Standard Sizes
```typescript
// Inputs and buttons
size="small"    // 32px height
size="medium"   // 40px height (default)
size="large"    // 48px height

// Examples
<Button size="medium">       // 40px
<TextField size="medium">    // 40px
<Select size="medium">       // 40px
```

### Icon Sizes
```typescript
fontSize="small"     // 16px
fontSize="medium"    // 20px (default)
fontSize="large"     // 24px

// Custom size
sx={{ fontSize: 16 }}
sx={{ fontSize: 20 }}
sx={{ fontSize: 24 }}
```

## Design Token Reference

### Importing Tokens
```typescript
import { capitalDesignTokens, capitalMuiTheme } from '@opengov/capital-mui-theme';

// Use tokens for consistency
const colors = capitalDesignTokens.foundations.colors;
const spacing = capitalDesignTokens.foundations.typography;
```

### Common Token Patterns
```typescript
// ❌ OLD - Hardcoded values
const palette = {
  primary: '#4b3fff',
  success: '#037730',
  spacing: '16px'
}

// ✅ NEW - Design system tokens
const palette = {
  primary: capitalDesignTokens.foundations.colors.blurple700,
  success: capitalDesignTokens.semanticColors.foreground.successLarge,
  spacing: theme.spacing(2) // 16px
}
```

## Transition Timing

### Standard Durations
- **Shortest (150ms)**: Tooltips, ripples, micro-interactions
- **Shorter (200ms)**: Drawers (horizontal slide)
- **Short (250ms)**: Page transitions
- **Standard (300ms)**: Modals, dialogs

### Usage
```typescript
import { transitions } from '@/theme';

// Pages - wrap content
<PageTransition type="fade">
  <YourPage />
</PageTransition>

// Custom transitions
<Fade timeout={transitions.getDuration(transitions.durations.standard)}>
  {content}
</Fade>
```

### ❌ NEVER
- Hardcode transition durations (`timeout: 500`)
- Skip `transitions.getDuration()` wrapper
- Use different transitions for similar components

## Validation Checklist

Before using theme customizations:

- [ ] Checked if Capital already provides the styling
- [ ] Used design tokens instead of hardcoded values
- [ ] Followed spacing multiples of 8px
- [ ] Used correct typography variants
- [ ] Applied responsive breakpoints where needed
- [ ] Documented why override exists (if adding one)
- [ ] Tested in light/dark modes (if applicable)

## Related Skills

- `seamstress-core-principles` - For theme token requirement
- `seamstress-component-hierarchy` - For import priority
- `seamstress-figma-integration` - For design token sync

## Summary

Seamstress theme system extends Capital Design System with minimal overrides. Always:
- Use theme tokens from palette and spacing
- Check Capital theme before adding overrides
- Document why custom styling is needed
- Maintain consistency with base design system

**Remember**: Extend, don't replace. Use `theme.palette.*` and `theme.spacing()` exclusively!

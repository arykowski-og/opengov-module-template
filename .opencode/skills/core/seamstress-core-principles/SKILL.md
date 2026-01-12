---
name: seamstress-core-principles
description: Core principles and golden rules for building Seamstress React prototypes with OpenGov Capital Design System, including validation checklist, anti-patterns, and transition policies. Use when generating any Seamstress component or page.
---

# Seamstress Core Principles

## Mission

Transform user requests into production-ready OpenGov React prototypes using TypeScript, Capital Design System, and MUI components.

## Golden Rules

### ✅ ALWAYS

1. **Use PageHeaderComposable on every page**
   - Required component at top of all page layouts
   - Contains title, actions, breadcrumbs
   - No exceptions

2. **Use theme tokens only**
   - `color: 'primary.main'` NOT `color: '#4b3fff'`
   - `p: 2` NOT `padding: '16px'`
   - Reference `theme` object or design tokens
   - All colors from theme palette
   - All spacing via theme.spacing()

3. **Use entity-scoped routes**
   - Format: `/entity/${entityId}/resource`
   - Example: `/entity/123/skills`, `/entity/456/agents`
   - Always include entity context in URLs
   - Never use non-scoped routes for resources

4. **Handle all states**
   - Loading state (skeleton or spinner)
   - Error state (with retry option)
   - Empty state (with call-to-action)
   - Success state (actual content)
   - All four states required in every data-driven component

5. **Generate realistic mock data**
   - Use `mockGenerators` from `.seamstress/contexts/mock-generators.ts`
   - Include variety (different statuses, dates, names)
   - Use standard scenarios: empty, minimal, standard, large

6. **Follow TypeScript best practices**
   - Explicit types for all props and state
   - No `any` types
   - Use interfaces for complex types
   - Export types alongside components

### ❌ NEVER

1. **Hardcode colors or spacing**
   - NO: `color: '#4b3fff'`
   - NO: `padding: '16px'`
   - NO: `backgroundColor: 'rgb(75, 63, 255)'`
   - YES: Use theme tokens (`color: 'primary.main'`, `p: 2`)

2. **Override Alert colors with hardcoded values**
   - NO: `<Alert sx={{ bgcolor: '#9333EA', border: '2px solid #9333EA' }}>`
   - YES (theme tokens): `<Alert sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>`
   - BETTER: Use `Paper` instead when custom branding colors needed
   - Alert components have built-in theming that conflicts with custom colors
   - For custom colored sections, use Paper with theme-aware color variables

3. **Create files in lib/opengov-packages**
   - This directory is for OpenGov dependencies only
   - Custom code goes in `src/`
   - Never modify OpenGov package files

3. **Use inline styles**
   - NO: `style={{ padding: '16px' }}`
   - YES: `sx={{ p: 2 }}`
   - Always use sx prop or styled components

4. **Skip PageHeaderComposable**
   - Every page must have it
   - No exceptions, even for simple pages

5. **Import MUI icons when OpenGov has them**
   - Check `@opengov/react-capital-assets` first
   - Only use MUI icons if not available in OpenGov
   - Document why MUI icon was needed

6. **Make direct API calls in components**
   - Use service layer or custom hooks
   - Components should be presentational
   - Business logic belongs in hooks/services

## Required Page Structure

Every page MUST follow this structure:

```typescript
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
  {/* REQUIRED: Every page must have PageHeaderComposable */}
  <PageHeaderComposable>
    <PageHeaderComposable.Header>
      <PageHeaderComposable.Title>{title}</PageHeaderComposable.Title>
      <PageHeaderComposable.Actions>
        {/* Action buttons */}
      </PageHeaderComposable.Actions>
    </PageHeaderComposable.Header>
  </PageHeaderComposable>

  {/* Content area with proper spacing */}
  <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
    {/* Page content */}
  </Box>
</Box>
```

## Theme Architecture

### Build Resolution Hierarchy

```
MUI Components (base)
  ↓ applies
Capital Design Tokens opengov design-tokens
  ↓ applies
Capital MUI Theme opengov mui-theme
  ↓ extends
Seamstress Overrides (src/theme/theme.ts, src/theme/components.ts)
  ↓ validates against
Figma Design (final check)
  ↓
Final Rendered Component
```

### Design Philosophy

- **Extend, don't replace** - Build on Capital's foundation
- **Minimal overrides** - Only customize what's truly different
- **Document rationale** - Explain why each override exists
- **Use design tokens** - No hardcoded values ever
- **Dark mode first** - All colors must work in both light and dark modes

### Dark Mode Compatibility

All components must support both light and dark themes:

```typescript
// ✅ Theme-aware colors
const theme = useTheme();
const isDark = theme.palette.mode === 'dark';
const customColor = isDark ? '#A855F7' : '#9333EA'; // Lighter in dark mode

// ✅ Using theme tokens (automatic adaptation)
bgcolor: theme.palette.background.paper
color: theme.palette.text.primary

// ❌ Hardcoded colors (breaks in dark mode)
bgcolor: '#FFFFFF'
color: '#000000'
```

**Testing checklist:**
- [ ] Verify component in both light and dark modes
- [ ] Text remains readable in both themes
- [ ] Custom colors adjust appropriately for dark backgrounds
- [ ] Borders and dividers use theme tokens

## Validation Checklist

Before considering any component complete:

### Layout & Structure
- [ ] PageHeaderComposable present
- [ ] Proper Box hierarchy with flexbox
- [ ] Entity-scoped routes used
- [ ] Responsive design (use breakpoints)

### Styling
- [ ] Theme tokens only (no hardcoded values)
- [ ] Proper spacing (multiples of 8px via theme.spacing)
- [ ] Correct typography (theme.typography)
- [ ] Consistent borders (use theme tokens)
- [ ] Dark mode compatibility verified (test in both themes)
- [ ] Text readable in both light and dark modes

### Functionality
- [ ] Loading state implemented
- [ ] Error state with retry
- [ ] Empty state with CTA
- [ ] Success state with data

### Code Quality
- [ ] TypeScript types for all props
- [ ] Proper import order (OpenGov → MUI → Local)
- [ ] No inline styles
- [ ] Clean, readable code

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Color contrast meets WCAG AA

## Common Anti-Patterns to Avoid

### ❌ Wrong: Hardcoded Values
```typescript
<Box sx={{
  color: '#4b3fff',
  padding: '16px',
  margin: '8px'
}}>
```

### ✅ Right: Theme Tokens
```typescript
<Box sx={{
  color: 'primary.main',
  p: 2,
  m: 1
}}>
```

### ❌ Wrong: Inline Styles
```typescript
<div style={{ padding: '16px', color: 'blue' }}>
```

### ✅ Right: sx Prop
```typescript
<Box sx={{ p: 2, color: 'primary.main' }}>
```

### ❌ Wrong: Missing PageHeader
```typescript
export default function MyPage() {
  return (
    <Box>
      <Typography variant="h4">My Page</Typography>
      {/* content */}
    </Box>
  );
}
```

### ✅ Right: With PageHeader
```typescript
export default function MyPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>My Page</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ flex: 1, p: 2 }}>
        {/* content */}
      </Box>
    </Box>
  );
}
```

## Transition Policy

### Standard Durations
- **Shortest (150ms)**: Tooltips, ripples, micro-interactions
- **Shorter (200ms)**: Drawers (horizontal slide)
- **Short (250ms)**: Page transitions
- **Standard (300ms)**: Modals, dialogs

### Usage
```typescript
import { transitions } from '@/theme';
import PageTransition from '@/components/PageTransition';

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

## Entity-Scoped Routing Pattern

All resources must be scoped to an entity:

```typescript
// Routes structure
/entity/:entityId/skills          // List skills for entity
/entity/:entityId/skills/new      // Create new skill
/entity/:entityId/skills/:id      // View skill detail
/entity/:entityId/skills/:id/edit // Edit skill

// Navigation
import { useNavigate, useParams } from 'react-router-dom';

const { entityId } = useParams();
const navigate = useNavigate();

// Navigate to entity-scoped route
navigate(`/entity/${entityId}/skills/new`);
```

## Related Skills

When building Seamstress components, also reference:
- `seamstress-component-hierarchy` - For import priority and component selection
- `seamstress-routing-patterns` - For navigation and routing details
- `seamstress-theme-system` - For theme customization and tokens
- `seamstress-business-logic` - For data fetching and state management

## Summary

These core principles ensure:
- **Consistency** across all Seamstress components
- **Maintainability** through proper architecture
- **Quality** via validation and best practices
- **Accessibility** through semantic HTML and ARIA
- **Performance** via optimized patterns

**Remember**: When in doubt, check OpenGov packages first, use theme tokens, and always include PageHeaderComposable!

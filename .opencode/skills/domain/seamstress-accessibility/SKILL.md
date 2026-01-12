---
name: seamstress-accessibility
description: WCAG 2.1 AA accessibility standards, keyboard navigation, ARIA patterns, and screen reader support for Seamstress applications. Use when ensuring accessible component implementation.
---

# Seamstress Accessibility Standards

## Standards

- **WCAG 2.1 AA** compliance required
- **Section 508** compliance by default
- Capital Design System has built-in accessibility features

## Core UI Rules

### 1. Color Contrast

- **Body text**: Minimum 4.5:1 contrast ratio
- **Headings and large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio
- Use Capital's color tokens which are pre-validated

```typescript
// ✅ GOOD - Capital tokens are accessible by default
<Typography sx={{ color: 'text.primary' }}>
  Body text with proper contrast
</Typography>

// ❌ BAD - Custom colors may not meet contrast requirements
<Typography sx={{ color: '#999' }}>
  May not have sufficient contrast
</Typography>
```

### 2. Keyboard Accessibility

**EVERYTHING must be keyboard-accessible**:
- All interactive elements reachable via Tab key
- Logical tab order (follows visual flow)
- Visible focus indicators
- Escape key closes modals/menus
- Enter/Space activates buttons

```typescript
// ✅ GOOD - Button is keyboard accessible by default
<Button onClick={handleClick}>
  Submit
</Button>

// ❌ BAD - Div with onClick is not keyboard accessible
<div onClick={handleClick}>
  Submit
</div>

// ✅ GOOD - If you must use div, add keyboard support
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Submit
</div>
```

### 3. No Interaction Tied Solely to Color or Hover

Provide alternative indicators:
- Icons alongside color
- Text labels, not just color
- Patterns or shapes for status
- Focus states independent of color

```typescript
// ❌ BAD - Status only indicated by color
<Chip label="Published" sx={{ backgroundColor: 'green' }} />

// ✅ GOOD - Status indicated by color AND icon
<Chip
  label="Published"
  color="success"
  icon={<Check />}
/>
```

### 4. Focus Management

**All modals must trap focus**:
- Prevent keyboard navigation outside modal
- Return focus to trigger element on close
- First focusable element receives focus on open

```typescript
// MUI Dialog handles focus trapping automatically
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Modal Title</DialogTitle>
  <DialogContent>
    <TextField autoFocus label="First field" />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleSubmit}>Submit</Button>
  </DialogActions>
</Dialog>
```

### 5. Form Field Labels

**All form fields must have programmatically associated labels**:
- Use `<label>` element with `htmlFor`
- Or use `aria-label` / `aria-labelledby`
- Placeholder text is NOT a label

```typescript
// ✅ GOOD - TextField has proper label
<TextField
  label="Email Address"
  required
  helperText="Enter your email"
/>

// ❌ BAD - No label, only placeholder
<input type="text" placeholder="Email" />

// ✅ GOOD - Custom input with aria-label
<input
  type="text"
  aria-label="Email Address"
/>
```

## Capital Design System A11y Features

Capital provides built-in accessibility features:

### Focus Rings
- Visible focus indicators on all interactive elements
- Capital's default focus styles meet WCAG requirements
- Don't remove focus styles (`outline: none`)

### Skip Links
- Keyboard users can skip to main content
- Built into navigation components

### ARIA Live Regions
- Toasts and Alerts are screen reader accessible
- Status updates announced to assistive technology

### Semantic HTML First
- Native HTML used before ARIA
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic elements (<nav>, <main>, <aside>)

## Common Accessibility Patterns

### Buttons vs Links

```typescript
// ✅ Button - for actions
<Button onClick={handleSubmit}>
  Submit Form
</Button>

// ✅ Link - for navigation
<Link href="/entity/${entityId}/skills">
  View Skills
</Link>

// ❌ BAD - Using link for action
<Link onClick={handleSubmit}>Submit</Link>

// ❌ BAD - Using button for navigation
<Button onClick={() => navigate('/skills')}>View Skills</Button>
```

### Images and Icons

```typescript
// ✅ Decorative icon (hidden from screen readers)
<Plus aria-hidden="true" />

// ✅ Meaningful icon (has label)
<IconButton aria-label="Add new skill">
  <Plus />
</IconButton>

// ✅ Image with alt text
<img src="chart.png" alt="Sales data for Q4 showing 20% increase" />

// ✅ Decorative image
<img src="decoration.png" alt="" />
```

### Status Messages

```typescript
// ✅ GOOD - Alert is announced to screen readers
<Alert severity="success">
  Successfully saved changes
</Alert>

// ✅ GOOD - Live region for dynamic content
<div role="status" aria-live="polite">
  {statusMessage}
</div>

// For critical/urgent messages
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

### Loading States

```typescript
// ✅ GOOD - Loading state announced
<Box role="status" aria-live="polite">
  {loading && (
    <>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>Loading data...</Typography>
    </>
  )}
</Box>

// Or use aria-busy
<Box aria-busy={loading}>
  {loading ? <CircularProgress /> : <DataDisplay data={data} />}
</Box>
```

### Tables/DataGrid

```typescript
// MUI DataGrid has built-in accessibility
<DataGrid
  rows={rows}
  columns={columns}
  aria-label="Skills list"
/>

// For custom tables, ensure proper structure
<table>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Skill 1</td>
      <td>Published</td>
    </tr>
  </tbody>
</table>
```

### Form Validation

```typescript
// ✅ GOOD - Error message associated with field
<TextField
  label="Email"
  error={Boolean(errors.email)}
  helperText={errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>

// ✅ GOOD - Announce validation errors
{errors._form && (
  <Alert severity="error" role="alert">
    {errors._form}
  </Alert>
)}
```

## Testing Tools

### Automated Testing
- **axe DevTools**: Browser extension for accessibility scanning
- **Lighthouse**: Built into Chrome DevTools
- **WAVE**: Web accessibility evaluation tool

### Screen Reader Testing
- **NVDA** (Windows): Free screen reader
- **JAWS** (Windows): Professional screen reader
- **VoiceOver** (macOS/iOS): Built-in screen reader
- **TalkBack** (Android): Built-in screen reader

### Keyboard Testing Checklist
- [ ] Tab through all interactive elements
- [ ] Verify logical tab order
- [ ] Check focus indicators are visible
- [ ] Test Escape key closes modals
- [ ] Test Enter/Space activates buttons
- [ ] Test arrow keys in custom controls
- [ ] Verify no keyboard traps

## Common Accessibility Issues to Avoid

### ❌ Missing Labels
```typescript
// BAD
<input type="text" placeholder="Enter name" />

// GOOD
<TextField label="Name" placeholder="Enter name" />
```

### ❌ Poor Focus Management
```typescript
// BAD - removing focus styles
<Button sx={{ '&:focus': { outline: 'none' } }}>

// GOOD - use Capital's default focus styles
<Button>
```

### ❌ Non-Semantic HTML
```typescript
// BAD
<div onClick={handleClick}>Click me</div>

// GOOD
<Button onClick={handleClick}>Click me</Button>
```

### ❌ Empty Links/Buttons
```typescript
// BAD
<IconButton>
  <Delete />
</IconButton>

// GOOD
<IconButton aria-label="Delete skill">
  <Delete />
</IconButton>
```

### ❌ Color-Only Information
```typescript
// BAD - status only shown by color
<Box sx={{ backgroundColor: 'green' }}>Active</Box>

// GOOD - status shown by color + icon + text
<Chip icon={<Check />} label="Active" color="success" />
```

## Validation Checklist

Before deploying components:

- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Form fields have labels
- [ ] Images have alt text (or empty alt for decorative)
- [ ] No information conveyed by color alone
- [ ] Modal focus is trapped
- [ ] Error messages associated with fields
- [ ] Status updates announced to screen readers
- [ ] Tested with keyboard navigation
- [ ] Tested with screen reader
- [ ] Passed axe DevTools scan

## Related Skills

- `seamstress-core-principles` - For accessibility in validation checklist
- `seamstress-component-hierarchy` - Capital components have a11y built-in

## Summary

Accessibility in Seamstress is non-negotiable:
- WCAG 2.1 AA compliance required
- Keyboard accessibility for everything
- Proper labels and ARIA attributes
- Capital Design System provides a11y foundation
- Test with assistive technology

**Remember**: Accessibility is not optional. Build it in from the start!

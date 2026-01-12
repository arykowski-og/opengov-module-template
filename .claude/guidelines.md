# OpenGov Capital Design System Guidelines

## General Guidelines

### Code Structure
- Use TypeScript with explicit types for all components
- Import order: React → Local OpenGov replicas (`./lib/opengov`) → MUI → Local files
- Use functional components with hooks
- Export TypeScript interfaces alongside components

### Required Imports
```tsx
// Theme and components from local OpenGov replica
import { capitalMuiTheme, PageHeaderComposable, Icons } from './lib/opengov';
import { ThemeProvider } from '@mui/material/styles';

// MUI components
import { Box, Button, TextField, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
```

### Styling
- **Always** use `theme.palette.*` for colors - never hardcode hex values
- **Always** use `theme.spacing()` for spacing - all values must be multiples of 8px
- Use `sx` prop for styling, not inline styles
- Component hierarchy: Use Box, Stack, or Paper as containers

### Routing
- All routes must be entity-scoped: `/entity/${entityId}/resource`
- Example: `/entity/123/skills`, `/entity/456/agents`
- Never use non-scoped routes like `/skills` or `/agents`

### State Management
- Handle all four states in data components:
  1. Loading: Show CircularProgress or Skeleton
  2. Error: Show Alert with error message and retry button
  3. Empty: Show empty state with call-to-action button
  4. Success: Display actual data

---

## Design System Guidelines

### Colors
Use theme palette only - no hardcoded colors:

| Do | Don't |
|---|---|
| `color: theme.palette.primary.main` | `color: '#4B3FFF'` |
| `bgcolor: theme.palette.background.paper` | `bgcolor: '#FFFFFF'` |
| `color: theme.palette.text.primary` | `color: '#111827'` |

### Spacing
Use theme spacing function with 8px grid:

| Do | Don't |
|---|---|
| `padding: theme.spacing(2)` (16px) | `padding: '16px'` |
| `margin: theme.spacing(3)` (24px) | `margin: '24px'` |
| `gap: theme.spacing(1)` (8px) | `gap: '8px'` |

**Spacing multipliers:**
- spacing(1) = 8px
- spacing(2) = 16px
- spacing(3) = 24px
- spacing(4) = 32px

### Typography
Use MUI Typography component with these variants:

| Variant | Size | Weight | Use Case |
|---|---|---|---|
| h4 | 34px | 600 | Page titles |
| h5 | 24px | 600 | Section headings |
| h6 | 20px | 600 | Subsection headings |
| body1 | 16px | 400 | Main content |
| body2 | 14px | 400 | Secondary content |
| button | 14px | 500 | Button text (uppercase) |
| caption | 12px | 400 | Metadata, hints |

### Dark Mode
All components must support both light and dark themes:
- Use theme-aware colors that automatically adapt
- Test contrast ratios in both modes
- Avoid hardcoded colors that break in dark mode

---

## Component Guidelines

### PageHeaderComposable
**Required on every page** - no exceptions.

```tsx
import { PageHeaderComposable, Icons } from './lib/opengov';

<PageHeaderComposable>
  <PageHeaderComposable.Header>
    <PageHeaderComposable.Title>Page Title</PageHeaderComposable.Title>
    <PageHeaderComposable.Actions>
      <Button startIcon={<Icons.Plus />} onClick={handleCreate}>
        Create
      </Button>
    </PageHeaderComposable.Actions>
  </PageHeaderComposable.Header>
</PageHeaderComposable>
```

**Rules:**
- Always place at top of page layout
- Use Title for page heading
- Use Actions for primary action buttons
- Import from `'./lib/opengov'`

### Buttons
Use MUI Button component with icons from `./lib/opengov`.

**Variants:**
- `variant="contained"` - Primary actions
- `variant="outlined"` - Secondary actions
- `variant="text"` - Tertiary actions

**Icons:**
- Import from `./lib/opengov` Icons namespace
- Icons are already MUI components, use directly as startIcon/endIcon

```tsx
import { Icons } from './lib/opengov';
import { Button } from '@mui/material';

<Button variant="contained" startIcon={<Icons.Plus />}>
  Create
</Button>
```

### DataGrid
Use MUI DataGrid for lists and tables.

**Required features:**
- Column definitions with GridColDef type
- Row click handlers for navigation
- Loading state with overlay
- Empty state message

```tsx
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'status', headerName: 'Status', width: 120 }
];

<DataGrid
  rows={data}
  columns={columns}
  loading={loading}
  onRowClick={(params: GridRowParams) => navigate(`/entity/${entityId}/resource/${params.id}`)}
/>
```

### Forms
Use MUI form components with validation.

**Required:**
- Controlled inputs (useState for value)
- Validation with error feedback
- Helper text for guidance
- Required field indicators

```tsx
<TextField
  label="Skill Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={Boolean(errors.name)}
  helperText={errors.name || 'Enter a unique skill name'}
  required
  fullWidth
/>
```

### Cards
Use MUI Card or Paper components.

**Structure:**
```tsx
<Card sx={{ p: 2 }}>
  <Typography variant="h6">{title}</Typography>
  <Typography variant="body2" color="text.secondary">
    {description}
  </Typography>
</Card>
```

**Rules:**
- Use `p: 2` or `p: 3` for padding (16px or 24px)
- Use Paper for simple containers
- Use Card for elevated content with shadow

### Status Badges
Use MUI Chip component for status indicators.

**Colors (semantic):**
- `color="success"` - Active, Published, Completed
- `color="warning"` - Draft, Pending, In Progress
- `color="error"` - Archived, Failed, Rejected
- `color="default"` - Inactive, Unknown

```tsx
<Chip label="Published" color="success" size="small" />
```

### Search and Filters
Use TextField for search with debouncing.

```tsx
<TextField
  placeholder="Search..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
  }}
  fullWidth
/>
```

**Rules:**
- Include search icon as startAdornment
- Use debouncing for search (not on every keystroke)
- Place above DataGrid or card list

---

## Layout Patterns

### Page Layout
Every page must follow this structure:

```tsx
<Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
  {/* Header - Required */}
  <PageHeaderComposable>
    {/* ... */}
  </PageHeaderComposable>

  {/* Content Area */}
  <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
    {/* Page content */}
  </Box>
</Box>
```

### List View Pattern
For displaying multiple items with search/filter.

**Structure:**
1. PageHeaderComposable with "Create" button
2. Search TextField
3. Filter Chips (optional)
4. DataGrid or Card grid
5. Handle all 4 states (loading, error, empty, success)

### Form Pattern
For create/edit pages.

**Structure:**
1. PageHeaderComposable with "Save" and "Cancel" buttons
2. Form fields in Stack with spacing
3. Validation on all required fields
4. Unsaved changes warning (isDirty tracking)

### Detail View Pattern
For read-only display pages.

**Structure:**
1. PageHeaderComposable with "Edit" and "Delete" buttons
2. Content cards showing data
3. Metadata section (created, updated timestamps)
4. Related resources section (optional)

### Dashboard Pattern
For metrics and visualizations.

**Structure:**
1. PageHeaderComposable with title
2. Metric cards in Grid layout (responsive)
3. Charts and visualizations
4. Loading state per card

---

## Do's and Don'ts

### Colors

| Do | Don't |
|---|---|
| Use `theme.palette.primary.main` | Use `'#4B3FFF'` |
| Use `theme.palette.background.paper` | Use `'white'` or `'#FFFFFF'` |
| Use `theme.palette.text.secondary` | Use `'gray'` or `'#666'` |
| Use semantic MUI props: `color="primary"` | Mix semantic props with hardcoded values |

### Spacing

| Do | Don't |
|---|---|
| Use `theme.spacing(2)` | Use `'16px'` |
| Use `sx={{ p: 2, m: 3 }}` | Use `style={{ padding: '16px', margin: '24px' }}` |
| Stick to 8px grid (8, 16, 24, 32) | Use arbitrary values (13, 17, 21) |
| Use shorthand: `p`, `m`, `px`, `py` | Write out full names with px values |

### Components

| Do | Don't |
|---|---|
| Import from `@opengov/components-*` first | Assume MUI is always the answer |
| Use PageHeaderComposable on every page | Skip header for "simple" pages |
| Handle all 4 states (loading, error, empty, success) | Show only success state |
| Use entity-scoped routes | Use global routes like `/skills` |

### TypeScript

| Do | Don't |
|---|---|
| Define explicit interfaces for props | Use `any` type |
| Export types alongside components | Keep types internal only |
| Use `GridColDef` for DataGrid columns | Use generic object types |
| Type event handlers properly | Use implicit any for events |

---

## Examples

### Complete List Page Example

```tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComposable, Icons } from './lib/opengov';
import {
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

interface Skill {
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
}

export default function SkillsListPage() {
  const navigate = useNavigate();
  const { entityId } = useParams();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120 }
  ];

  const handleCreate = () => {
    navigate(`/entity/${entityId}/skills/new`);
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/entity/${entityId}/skills/${params.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Empty state
  if (skills.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <PageHeaderComposable>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>Skills</PageHeaderComposable.Title>
            <PageHeaderComposable.Actions>
              <Button
                variant="contained"
                startIcon={<Icons.Plus />}
                onClick={handleCreate}
              >
                Create Skill
              </Button>
            </PageHeaderComposable.Actions>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>No skills found</Typography>
            <Button variant="contained" onClick={handleCreate}>
              Create Your First Skill
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Success state
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Skills</PageHeaderComposable.Title>
          <PageHeaderComposable.Actions>
            <Button
              variant="contained"
              startIcon={<Icons.Plus />}
              onClick={handleCreate}
            >
              Create Skill
            </Button>
          </PageHeaderComposable.Actions>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <TextField
          placeholder="Search skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <DataGrid
          rows={skills}
          columns={columns}
          onRowClick={handleRowClick}
          autoHeight
        />
      </Box>
    </Box>
  );
}
```

---

## Critical Rules Summary

**Must Always Follow:**
1. Use PageHeaderComposable on every page
2. Use theme.palette.* for all colors (never hardcode)
3. Use theme.spacing() for all spacing (8px grid)
4. Handle all 4 states (loading, error, empty, success)
5. Use entity-scoped routes: `/entity/${entityId}/resource`
6. Use TypeScript with explicit types
7. Import order: React → `./lib/opengov` → MUI → Local
8. Import OpenGov components from `./lib/opengov`

**Never Do:**
1. Hardcode colors with hex values
2. Hardcode spacing with px values
3. Skip PageHeaderComposable
4. Use non-scoped routes
5. Use `any` TypeScript type
6. Mix inline styles with sx prop
7. Create only default state without loading/error/empty
8. Try to import from `@opengov/*` packages (they're not available)

---

## Additional Resources

- **Capital MUI Theme**: `./lib/opengov` (theme.ts)
- **Page Header**: `./lib/opengov` (PageHeaderComposable.tsx)
- **Icons**: `./lib/opengov` (icons.tsx)
- **MUI Components**: https://mui.com/material-ui/
- **MUI DataGrid**: https://mui.com/x/react-data-grid/

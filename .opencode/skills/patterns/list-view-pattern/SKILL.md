---
name: list-view-pattern
description: DataGrid list view pattern with search, filters, and pagination for Seamstress. Generate lists, tables, grids, or index pages. Use when displaying multiple items with browsing capabilities.
---

# List View Pattern

## When to Use

Invoke when:
- **Keywords**: "list", "table", "grid", "search", "index", "browse"
- **User Intent**: View multiple items of same type
- **Features Needed**: Search, filters, pagination, sorting, row actions

## Skill Dependencies

This skill requires:
- `seamstress-core-principles` - Validation & golden rules
- `seamstress-component-hierarchy` - Import priority
- `seamstress-routing-patterns` - Entity-scoped navigation
- `seamstress-business-logic` - Data fetching with Effect.ts

## Required Imports

```typescript
// React (Priority 0)
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// OpenGov (Priority 1 - ALWAYS CHECK FIRST)
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Plus } from '@opengov/react-capital-assets';

// MUI (Priority 2)
import {
  Box,
  Button,
  TextField,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Typography,
  InputAdornment
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
```

## Component Structure

```typescript
export default function EntityListPage() {
  const navigate = useNavigate();
  const { entityId } = useParams();

  // State management
  const [data, setData] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Data fetching (use Effect.ts pattern or custom hook)
  useEffect(() => {
    // Load data here using Effect.ts
  }, [entityId, searchQuery]);

  // Event handlers
  const handleCreate = () => {
    navigate(`/entity/${entityId}/resource/new`);
  };

  const handleRowClick = (params: GridRowParams) => {
    navigate(`/entity/${entityId}/resource/${params.id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* REQUIRED: PageHeaderComposable */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>
            {entityName} List
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Actions>
            <Button startIcon={<Plus />} onClick={handleCreate}>
              Create {entityName}
            </Button>
          </PageHeaderComposable.Actions>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {/* Search and Filters */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="medium"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={refetch} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Empty State */}
        {!loading && !error && data.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No {entityName}s found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? 'Try adjusting your search or filters'
                : `Create your first ${entityName.toLowerCase()}`
              }
            </Typography>
            <Button startIcon={<Plus />} onClick={handleCreate}>
              Create {entityName}
            </Button>
          </Box>
        )}

        {/* Success State - DataGrid */}
        {!loading && !error && data.length > 0 && (
          <DataGrid
            rows={data}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            onRowClick={handleRowClick}
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
```

## Column Definition Pattern

Map schema fields to DataGrid columns:

```typescript
const columns: GridColDef[] = [
  // Text field
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 200
  },

  // Long text field
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 300
  },

  // Status field with Chip
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 'published' ? 'success' : 'default'}
      />
    )
  },

  // Date field
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 150,
    valueFormatter: (params) => {
      return params.value ? new Date(params.value).toLocaleDateString() : '';
    }
  },
];
```

## State Requirements Checklist

- [ ] Loading state with spinner
- [ ] Error state with retry
- [ ] Empty state with CTA
- [ ] Success state with data
- [ ] Search query state
- [ ] Filter state (if applicable)

## Validation Checklist

- [ ] PageHeaderComposable present
- [ ] Entity-scoped routes: `/entity/${entityId}/resource`
- [ ] Theme tokens only (no hardcoded values)
- [ ] OpenGov icons (Plus, Pencil, Trash)
- [ ] All 4 states implemented
- [ ] Row click navigation
- [ ] DataGrid cells vertically centered: `display: 'flex', alignItems: 'center'`

## Related Skills

- For form pages: See `form-pattern`
- For detail pages: See `detail-view-pattern`
- For routing: See `seamstress-routing-patterns`

## Full Templates

- **Full version**: `.seamstress/templates/patterns/list-template.tsx`
- **Minimal version**: `.seamstress/templates/minimal/list-template-minimal.tsx`

---
name: detail-view-pattern
description: Read-only detail view pattern with edit/delete actions for Seamstress. Generate detail, view, or show pages. Use when displaying complete information about a single entity.
---

# Detail View Pattern

## When to Use

Invoke when:
- **Keywords**: "detail", "view", "show", "display", "read-only"
- **User Intent**: View complete information about a single entity
- **Features Needed**: Display all fields, edit button, delete action

## Skill Dependencies

This skill requires:
- `seamstress-core-principles` - Validation & golden rules
- `seamstress-component-hierarchy` - Import priority
- `seamstress-routing-patterns` - Entity-scoped navigation
- `seamstress-business-logic` - Data fetching with Effect.ts

## Required Imports

```typescript
// React
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// OpenGov (Priority 1)
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Pencil, Trash } from '@opengov/react-capital-assets';

// MUI (Priority 2)
import {
  Box,
  Button,
  Typography,
  Stack,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
```

## Component Structure

```typescript
export default function EntityDetailPage() {
  const navigate = useNavigate();
  const { entityId, id } = useParams();

  // State
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load entity data
  useEffect(() => {
    if (id) {
      loadEntity(id);
    }
  }, [id]);

  // Handlers
  const handleEdit = () => {
    navigate(`/entity/${entityId}/resource/${id}/edit`);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEntity(id);
      navigate(`/entity/${entityId}/resource`);
    } catch (error) {
      setError('Failed to delete');
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleBack = () => {
    navigate(`/entity/${entityId}/resource`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* REQUIRED: PageHeaderComposable */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>
            {entity?.title || 'Loading...'}
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Actions>
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="outlined"
              startIcon={<Pencil />}
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Trash />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </PageHeaderComposable.Actions>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert severity="error">
            {error}
            <Button onClick={refetch} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Detail View */}
        {!loading && !error && entity && (
          <Box sx={{ maxWidth: 800 }}>
            <Stack spacing={3}>
              {/* Field Group */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1">
                  {entity.title}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {entity.description}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Status
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={entity.status}
                    color={entity.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider />

              {/* Metadata Section */}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Metadata
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Created: {new Date(entity.createdAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Updated: {new Date(entity.updatedAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{entity?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
```

## Field Display Patterns

### Text Field
```typescript
<Box>
  <Typography variant="caption" color="text.secondary">
    Field Label
  </Typography>
  <Typography variant="body1">
    {entity.fieldValue}
  </Typography>
</Box>
```

### Status with Chip
```typescript
<Box>
  <Typography variant="caption" color="text.secondary">
    Status
  </Typography>
  <Box sx={{ mt: 0.5 }}>
    <Chip
      label={entity.status}
      color={getStatusColor(entity.status)}
      size="small"
    />
  </Box>
</Box>
```

### Date Field
```typescript
<Box>
  <Typography variant="caption" color="text.secondary">
    Created
  </Typography>
  <Typography variant="body1">
    {new Date(entity.createdAt).toLocaleString()}
  </Typography>
</Box>
```

## State Requirements Checklist

- [ ] Entity data state
- [ ] Loading state
- [ ] Error state
- [ ] Delete dialog open state
- [ ] Deleting state

## Validation Checklist

- [ ] PageHeaderComposable present
- [ ] Edit button with Pencil icon
- [ ] Delete button with Trash icon
- [ ] Back button for navigation
- [ ] Loading state with CircularProgress
- [ ] Error state with retry
- [ ] Delete confirmation dialog
- [ ] Entity-scoped routes
- [ ] Theme tokens only

## Related Skills

- For list pages: See `list-view-pattern`
- For form pages: See `form-pattern`
- For routing: See `seamstress-routing-patterns`

## Full Templates

- **Full version**: `.seamstress/templates/patterns/detail-template.tsx`
- **Minimal version**: `.seamstress/templates/minimal/detail-template-minimal.tsx`

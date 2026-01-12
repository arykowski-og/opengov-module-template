---
name: form-pattern
description: Create/edit form pattern with validation for Seamstress. Generate forms for creating or editing entities. Use when building forms with validation, dirty state tracking, and submission handling.
---

# Form Pattern

## When to Use

Invoke when:
- **Keywords**: "form", "create", "edit", "save", "new"
- **User Intent**: Input data to create or update an entity
- **Features Needed**: Validation, error handling, unsaved changes warning

## Skill Dependencies

This skill requires:
- `seamstress-core-principles` - Validation & golden rules
- `seamstress-component-hierarchy` - Import priority
- `seamstress-routing-patterns` - Entity-scoped navigation
- `seamstress-business-logic` - Data submission with Effect.ts

## Required Imports

```typescript
// React
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// OpenGov (Priority 1)
import { PageHeaderComposable } from '@opengov/components-page-header';

// MUI (Priority 2)
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
```

## Component Structure

```typescript
export default function EntityFormPage() {
  const navigate = useNavigate();
  const { entityId, id } = useParams();
  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState<EntityFormData>({
    title: '',
    description: '',
    status: 'draft',
  });
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadEntity(id);
    }
  }, [id, isEditMode]);

  // Field change handler
  const handleFieldChange = (field: keyof EntityFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setIsDirty(true);

    // Clear field error on change
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save handler
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSaveError(null);

    try {
      if (isEditMode) {
        await updateEntity(id, formData);
      } else {
        await createEntity(formData);
      }
      navigate(`/entity/${entityId}/resource`);
    } catch (error) {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate(`/entity/${entityId}/resource`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* REQUIRED: PageHeaderComposable */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>
            {isEditMode ? 'Edit' : 'Create'} {entityName}
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Actions>
            <Button variant="text" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !isDirty}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </PageHeaderComposable.Actions>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        {saveError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {saveError}
          </Alert>
        )}

        <Box sx={{ maxWidth: 800 }}>
          <Stack spacing={3}>
            {/* Text Field */}
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleFieldChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              required
              fullWidth
            />

            {/* Multiline Text Field */}
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleFieldChange('description')}
              error={Boolean(errors.description)}
              helperText={errors.description}
              multiline
              rows={4}
              required
              fullWidth
            />

            {/* Select Field */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    status: e.target.value
                  }));
                  setIsDirty(true);
                }}
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
```

## Field Type Patterns

### Text Input
```typescript
<TextField
  label="Field Name"
  value={formData.fieldName}
  onChange={handleFieldChange('fieldName')}
  error={Boolean(errors.fieldName)}
  helperText={errors.fieldName}
  required
  fullWidth
/>
```

### Select/Dropdown
```typescript
<FormControl fullWidth>
  <InputLabel>Field Name</InputLabel>
  <Select
    value={formData.fieldName}
    onChange={(e) => {
      setFormData(prev => ({ ...prev, fieldName: e.target.value }));
      setIsDirty(true);
    }}
    label="Field Name"
  >
    <MenuItem value="option1">Option 1</MenuItem>
    <MenuItem value="option2">Option 2</MenuItem>
  </Select>
</FormControl>
```

## Validation Patterns

### Required Field
```typescript
if (!formData.title.trim()) {
  newErrors.title = 'Title is required';
}
```

### Length Validation
```typescript
if (formData.title.length > 100) {
  newErrors.title = 'Title must be less than 100 characters';
}
```

### Email Validation
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  newErrors.email = 'Invalid email format';
}
```

## State Requirements Checklist

- [ ] Form data state (all fields)
- [ ] isDirty flag
- [ ] Validation errors object
- [ ] Loading state
- [ ] Save error state
- [ ] Edit mode detection

## Validation Checklist

- [ ] PageHeaderComposable present
- [ ] Save/Cancel buttons in header actions
- [ ] Form validation before save
- [ ] Error display for each field
- [ ] Unsaved changes warning on cancel
- [ ] Loading state during save
- [ ] Success navigation after save
- [ ] Theme tokens only

## Related Skills

- For list pages: See `list-view-pattern`
- For detail pages: See `detail-view-pattern`
- For business logic: See `seamstress-business-logic`

## Full Templates

- **Full version**: `.seamstress/templates/patterns/form-template.tsx`
- **Minimal version**: `.seamstress/templates/minimal/form-template-minimal.tsx`

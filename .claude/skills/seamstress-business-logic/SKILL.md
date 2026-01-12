---
name: seamstress-business-logic
description: Effect.ts patterns, data fetching with abort controllers, state management, and API integration for Seamstress applications. Use when implementing data operations, async logic, or API calls.
---

# Seamstress Business Logic Patterns

## Core Principles

1. **Effect.ts for all async operations** - Never use raw promises
2. **Entity-scoped data access** - All resources belong to an entity
3. **Optimistic UI updates** - Update UI before API confirmation
4. **Graceful error handling** - Always provide fallbacks
5. **Abort controllers** - Clean up async operations on unmount

## Data Fetching Pattern

### Custom Hook Structure
```typescript
export const useResourceList = ({ entityId, filter }: ResourceParams) => {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const withRuntime = useRuntime();

  useEffect(() => {
    const controller = new AbortController();

    void withRuntime(
      (runtime) =>
        Effect.gen(function* () {
          setLoading(true);
          setError(null);

          try {
            const result = yield* runtime.apiClient.resource.list({
              path: { entityIdOrSlug: entityId },
              query: filter
            });

            setData(result.items);
          } catch (e) {
            setError('Failed to load resources');
          } finally {
            setLoading(false);
          }
        }).pipe(
          Effect.onError((cause) =>
            Effect.gen(function* () {
              yield* Effect.logError('Failed to fetch resources', cause);
              if (!Cause.isInterrupted(cause)) {
                setError('An error occurred');
              }
              setLoading(false);
            })
          )
        ),
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [entityId, filter, withRuntime]);

  const refetch = useCallback(() => {
    // Trigger refetch by updating dependency
  }, [entityId, filter]);

  return { data, loading, error, refetch };
};
```

### API Client Pattern
```typescript
// All API calls go through runtime.apiClient
runtime.apiClient.skills.listSkills({ path, query })
runtime.apiClient.agents.createAgent({ path, body })
runtime.apiClient.tasks.getTaskById({ path })
runtime.apiClient.toolkits.updateToolkit({ path, body })
```

## State Management Patterns

### Local Component State
```typescript
// UI state that doesn't need to be shared
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [selectedItems, setSelectedItems] = useState<string[]>([]);
```

### Form State Management
```typescript
const [formData, setFormData] = useState<FormData>(initialData);
const [isDirty, setIsDirty] = useState(false);
const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

const handleFieldChange = (field: keyof FormData) => (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setFormData(prev => ({
    ...prev,
    [field]: event.target.value
  }));
  setIsDirty(true);

  // Clear field error on change
  setValidationErrors(prev => ({
    ...prev,
    [field]: undefined
  }));
};

const validateForm = (): boolean => {
  const newErrors: ValidationErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = 'Title is required';
  }

  setValidationErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  setSubmitting(true);
  try {
    await saveData(formData);
    setIsDirty(false);
    navigate(`/entity/${entityId}/resource`);
  } catch (error) {
    setValidationErrors({ _form: 'Failed to save' });
  } finally {
    setSubmitting(false);
  }
};
```

## Create/Update Operations

### Create Pattern
```typescript
const useResourceCreate = ({ entityId }: { entityId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const withRuntime = useRuntime();

  const create = useCallback(async (data: CreateData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRuntime((runtime) =>
        Effect.gen(function* () {
          return yield* runtime.apiClient.resource.create({
            path: { entityIdOrSlug: entityId },
            body: data
          });
        })
      );

      return result;
    } catch (e) {
      setError('Failed to create resource');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [entityId, withRuntime]);

  return { create, loading, error };
};
```

### Update Pattern
```typescript
const useResourceUpdate = ({ entityId, id }: { entityId: string; id: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const withRuntime = useRuntime();

  const update = useCallback(async (data: UpdateData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await withRuntime((runtime) =>
        Effect.gen(function* () {
          return yield* runtime.apiClient.resource.update({
            path: { entityIdOrSlug: entityId, id },
            body: data
          });
        })
      );

      return result;
    } catch (e) {
      setError('Failed to update resource');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [entityId, id, withRuntime]);

  return { update, loading, error };
};
```

### Delete Pattern
```typescript
const useResourceDelete = ({ entityId }: { entityId: string }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const withRuntime = useRuntime();

  const deleteResource = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await withRuntime((runtime) =>
        Effect.gen(function* () {
          yield* runtime.apiClient.resource.delete({
            path: { entityIdOrSlug: entityId, id }
          });
        })
      );
    } catch (e) {
      setError('Failed to delete resource');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [entityId, withRuntime]);

  return { deleteResource, loading, error };
};
```

## Error Handling

### Granular Error States
```typescript
interface ErrorState {
  type: 'network' | 'validation' | 'server' | 'unknown';
  message: string;
  retryable: boolean;
}

const handleError = (error: unknown): ErrorState => {
  if (error instanceof NetworkError) {
    return {
      type: 'network',
      message: 'Network connection failed. Please check your internet.',
      retryable: true
    };
  }

  if (error instanceof ValidationError) {
    return {
      type: 'validation',
      message: error.message,
      retryable: false
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred',
    retryable: true
  };
};
```

### Error Display
```typescript
{error && (
  <Alert
    severity="error"
    action={
      error.retryable && (
        <Button color="inherit" size="small" onClick={refetch}>
          Retry
        </Button>
      )
    }
  >
    {error.message}
  </Alert>
)}
```

## Optimistic Updates

```typescript
const handleToggleStatus = async (id: string, newStatus: Status) => {
  // 1. Optimistically update UI
  setData(prev =>
    prev.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    )
  );

  try {
    // 2. Persist to backend
    await updateStatus(id, newStatus);
  } catch (error) {
    // 3. Rollback on failure
    setData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status: oldStatus } : item
      )
    );
    showError('Failed to update status');
  }
};
```

## Debouncing & Throttling

### Debounced Search
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [debouncedQuery, setDebouncedQuery] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(searchQuery);
  }, 300);

  return () => clearTimeout(timer);
}, [searchQuery]);

// Use debouncedQuery in API call
useEffect(() => {
  if (debouncedQuery) {
    fetchResults(debouncedQuery);
  }
}, [debouncedQuery]);
```

## Loading States

### Skeleton Loaders
```typescript
if (loading) {
  return (
    <Stack spacing={2}>
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} variant="rectangular" height={60} />
      ))}
    </Stack>
  );
}
```

### Progressive Loading
```typescript
const [initialLoading, setInitialLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

// Initial load - show skeleton
if (initialLoading) {
  return <Skeleton />;
}

// Subsequent loads - show spinner overlay
return (
  <>
    {refreshing && <LinearProgress />}
    <DataDisplay data={data} />
  </>
);
```

## Related Skills

- `seamstress-core-principles` - For state management requirements
- `seamstress-routing-patterns` - For entity-scoped API calls
- `seamstress-architecture` - For service layer organization

## Summary

All business logic in Seamstress must:
- Use Effect.ts for async operations
- Include abort controllers for cleanup
- Handle all error states gracefully
- Scope data to entity context
- Provide loading and error states
- Support optimistic updates where appropriate

**Remember**: Never make raw API calls from components - always use custom hooks with Effect.ts!

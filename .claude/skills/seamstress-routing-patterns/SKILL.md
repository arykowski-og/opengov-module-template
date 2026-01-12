---
name: seamstress-routing-patterns
description: Entity-scoped routing patterns, navigation, breadcrumbs, and route guards for Seamstress applications. Use when building navigation, routes, or links in entity-scoped contexts.
---

# Seamstress Routing Patterns

## Route Structure

All routes in Seamstress follow a hierarchical, entity-scoped pattern:

```
/entity/{entityId}/resource/{resourceId}
```

This ensures all resources are properly scoped to their parent entity.

## Standard Route Patterns

### CRUD Routes for a Resource
```typescript
// List all resources for an entity
/entity/:entityId/skills

// Create new resource
/entity/:entityId/skills/new

// View/detail resource
/entity/:entityId/skills/:id

// Edit resource (via query param)
/entity/:entityId/skills/:id?mode=edit
```

### Route Implementation
```typescript
// Main App Router
<Routes>
  {/* Unprotected routes */}
  <Route path="/admin/auth-callback" element={<AuthCallback />} />
  <Route path="/logout" element={<Logout />} />

  {/* Protected routes */}
  <Route element={<ProtectedLayout />}>
    <Route path="/entities" element={<EntityRegister />} />
    <Route path="/entity/:entityId/*" element={<EntityRoutes />} />
    <Route path="*" element={<Navigate to="/entities" replace />} />
  </Route>
</Routes>
```

### Sub-Router Pattern
```typescript
// SkillsRouter.tsx - handles /entity/:entityId/skills/*
export default function SkillsRouter() {
  const routes: RouteObject[] = [
    {
      path: '',
      element: <SkillsList />  // List view
    },
    {
      path: 'new',
      element: <SkillCreate />  // Create form
    },
    {
      path: ':id',
      element: <SkillDetail />  // Detail/Edit view
    }
  ];

  return useRoutes(routes);
}
```

## Navigation Patterns

### Programmatic Navigation
```typescript
import { useNavigate, useParams } from 'react-router-dom';

const { entityId } = useParams();
const navigate = useNavigate();

// Navigate to list
navigate(`/entity/${entityId}/skills`);

// Navigate to create
navigate(`/entity/${entityId}/skills/new`);

// Navigate to detail
navigate(`/entity/${entityId}/skills/${skillId}`);

// Navigate with replace (no history entry)
navigate('/entities', { replace: true });

// Navigate back
navigate(-1);
```

### Link Components
```typescript
// Using react-router Link
<Link to={`/entity/${entityId}/skills/${skill.id}`}>
  {skill.title}
</Link>

// Using MUI Button as link
<Button
  component={Link}
  to={`/entity/${entityId}/skills/new`}
  variant="contained"
>
  Create Skill
</Button>
```

### Navigation with State
```typescript
// Pass state through navigation
navigate(`/entity/${entityId}/skills/${id}`, {
  state: { from: 'search', query: searchQuery }
});

// Access state in target component
const location = useLocation();
const { from, query } = location.state || {};
```

## Route Parameters

### Extracting Parameters
```typescript
import { useParams } from 'react-router-dom';

const { entityId, id } = useParams<{
  entityId: string;
  id?: string;
}>();
```

### Query Parameters
```typescript
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();

// Read query parameter
const mode = searchParams.get('mode'); // ?mode=edit

// Set query parameter
setSearchParams({ mode: 'edit' });

// Remove query parameter
searchParams.delete('mode');
setSearchParams(searchParams);
```

## Breadcrumb Generation

```typescript
const generateBreadcrumbs = (
  entityId: string,
  resource: string,
  action?: string,
  title?: string
) => {
  const breadcrumbs = [
    { path: `/entity/${entityId}`, title: 'Home' },
    { path: `/entity/${entityId}/${resource}`, title: capitalize(resource) }
  ];

  if (action === 'new') {
    breadcrumbs.push({ title: `Create ${singularize(resource)}` });
  } else if (action === 'edit') {
    breadcrumbs.push({ title: title || 'Edit' });
  } else if (title) {
    breadcrumbs.push({ title });
  }

  return breadcrumbs;
};

// Usage in PageHeaderComposable
<PageHeaderComposable>
  <PageHeaderComposable.Header>
    <PageHeaderComposable.Breadcrumbs
      items={generateBreadcrumbs(entityId, 'skills', 'edit', skill.title)}
    />
    <PageHeaderComposable.Title>{skill.title}</PageHeaderComposable.Title>
  </PageHeaderComposable.Header>
</PageHeaderComposable>
```

## Navigation Guards

### Unsaved Changes Guard
```typescript
const useUnsavedChangesGuard = (isDirty: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const navigate = useNavigate();
  const handleNavigation = (to: string) => {
    if (isDirty && !confirm('You have unsaved changes. Continue?')) {
      return;
    }
    navigate(to);
  };

  return handleNavigation;
};

// Usage
const handleSafeNavigation = useUnsavedChangesGuard(isDirty);
<Button onClick={() => handleSafeNavigation('/entity/${entityId}/skills')}>
  Cancel
</Button>
```

### Protected Routes (Auth Guard)
```typescript
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### Entity Access Control
```typescript
const EntityGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { entityId } = useParams();
  const { userEntities } = useUser();

  if (!userEntities.includes(entityId)) {
    return <Navigate to="/entities" replace />;
  }

  return <>{children}</>;
};
```

## Lazy Loading Pattern
```typescript
// Lazy load route components for code splitting
const LazySkillsRouter = React.lazy(() => import('./pages/SkillsRouter'));

// Use with Suspense
<Route
  path="/entity/:entityId/skills/*"
  element={
    <React.Suspense fallback={<CircularProgress />}>
      <LazySkillsRouter />
    </React.Suspense>
  }
/>
```

## 404 Handling
```typescript
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h4">Page Not Found</Typography>
      <Button onClick={() => navigate('/entities')} sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </Box>
  );
};

// In router
<Route path="*" element={<NotFound />} />
```

## Document Title Updates
```typescript
const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} - Seamstress`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

// Usage in component
useDocumentTitle(`${skill.title} - Skills`);
```

## Related Skills

- `seamstress-core-principles` - For entity-scoped routing requirement
- `seamstress-architecture` - For understanding router hierarchy

## Summary

All Seamstress routes must be entity-scoped using the `/entity/:entityId/resource` pattern. This ensures:
- Proper resource isolation
- Clear data ownership
- Consistent navigation patterns
- Scalable multi-tenant architecture

**Remember**: Always extract `entityId` from route params and include it in all navigation!

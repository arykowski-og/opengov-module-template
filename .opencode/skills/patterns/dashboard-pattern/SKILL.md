---
name: dashboard-pattern
description: Dashboard pattern with metric cards and visualizations for Seamstress. Generate overview pages, dashboards, or analytics views. Use when displaying aggregated data and metrics.
---

# Dashboard Pattern

## When to Use

Invoke when:
- **Keywords**: "dashboard", "overview", "metrics", "analytics", "summary", "charts"
- **User Intent**: View aggregated data and key metrics
- **Features Needed**: Metric cards, charts, summary statistics

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

// MUI (Priority 2)
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
```

## Component Structure

```typescript
export default function DashboardPage() {
  const navigate = useNavigate();
  const { entityId } = useParams();

  // State
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardMetrics();
  }, [entityId]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* REQUIRED: PageHeaderComposable */}
      <PageHeaderComposable>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>
            Dashboard
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Actions>
            <Button variant="outlined" onClick={handleRefresh}>
              Refresh
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
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={refetch} sx={{ ml: 2 }}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Dashboard Content */}
        {!loading && !error && metrics && (
          <Grid container spacing={3}>
            {/* Metric Cards */}
            <Grid item sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard
                title="Total Items"
                value={metrics.totalItems}
                trend={metrics.itemsTrend}
              />
            </Grid>

            <Grid item sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard
                title="Active"
                value={metrics.activeItems}
                trend={metrics.activeTrend}
              />
            </Grid>

            <Grid item sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard
                title="Published"
                value={metrics.publishedItems}
                trend={metrics.publishedTrend}
              />
            </Grid>

            <Grid item sx={{ flex: '1 1 200px', minWidth: '200px' }}>
              <MetricCard
                title="Draft"
                value={metrics.draftItems}
              />
            </Grid>

            {/* Recent Activity */}
            <Grid item sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Stack spacing={2}>
                    {/* Activity items */}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    {/* Action buttons */}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
```

## Metric Card Component

```typescript
interface MetricCardProps {
  title: string;
  value: number | string;
  trend?: {
    direction: 'up' | 'down';
    percentage: number;
  };
}

function MetricCard({ title, value, trend }: MetricCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ my: 1 }}>
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="body2"
            color={trend.direction === 'up' ? 'success.main' : 'error.main'}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {trend.percentage}%
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
```

## Common Dashboard Patterns

### Status Distribution
```typescript
<Card>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Status Distribution
    </Typography>
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Published</Typography>
        <Typography>{metrics.published}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Draft</Typography>
        <Typography>{metrics.draft}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>Archived</Typography>
        <Typography>{metrics.archived}</Typography>
      </Box>
    </Stack>
  </CardContent>
</Card>
```

### Recent Items List
```typescript
<Card>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Recent Items
    </Typography>
    <Stack spacing={1}>
      {recentItems.map(item => (
        <Box
          key={item.id}
          sx={{
            p: 1,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' }
          }}
          onClick={() => navigate(`/entity/${entityId}/resource/${item.id}`)}
        >
          <Typography variant="body2">{item.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(item.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      ))}
    </Stack>
  </CardContent>
</Card>
```

## State Requirements Checklist

- [ ] Metrics data state
- [ ] Loading state
- [ ] Error state
- [ ] Refresh functionality

## Validation Checklist

- [ ] PageHeaderComposable present
- [ ] Responsive grid layout using flex pattern: `sx={{ flex: '1 1 200px', minWidth: '200px' }}`
- [ ] Grid children have `height: '100%'` for equal heights
- [ ] Metric cards with values
- [ ] Loading state with CircularProgress
- [ ] Error state with retry
- [ ] Entity-scoped routes
- [ ] Theme tokens only

## Related Skills

- For list views: See `list-view-pattern`
- For metrics data: See `seamstress-business-logic`
- For routing: See `seamstress-routing-patterns`

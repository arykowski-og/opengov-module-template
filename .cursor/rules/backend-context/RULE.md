---
description: "Backend architecture context for API integration and service communication"
globs: []
alwaysApply: false
---

# OpenGov Backend Architecture Context

This rule provides context about the backend services that this frontend communicates with.

## Backend Technology Stack

### APIs and Workflows: Node.js + NestJS

- RESTful API endpoints
- GraphQL where applicable
- Workflow orchestration services
- Authentication/Authorization services

**When integrating with NestJS APIs:**
- Expect standard REST conventions (GET, POST, PUT, DELETE)
- Error responses follow consistent format with status codes
- Authentication via JWT tokens
- API versioning in URL path (e.g., `/api/v1/`)

### Batch Processing: Java + Spring Boot

- Bill runs and billing cycles
- Report generation
- Data migration jobs
- Scheduled tasks

**When displaying batch job status:**
- Jobs may have states: PENDING, RUNNING, COMPLETED, FAILED
- Long-running operations use async patterns
- Progress tracking via polling or WebSocket

### Workflow Orchestration: Temporal

- Durable workflow execution
- Long-running business processes
- Retry and failure handling built-in
- Saga pattern for distributed transactions

**When integrating with Temporal workflows:**
- Workflows return a workflow ID for tracking
- Query workflow status via API
- Workflows survive service restarts
- Use for: approvals, multi-step processes, scheduled operations

## API Integration Patterns

### Data Fetching

Use React Router loaders for server-side data fetching:

```tsx
export const loader: Route.LoaderFunction = async ({ request }) => {
  const response = await fetch('/api/v1/resource', {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return response.json();
};
```

### Error Handling

Handle API errors consistently:

```tsx
try {
  const data = await apiCall();
} catch (error) {
  if (error.status === 401) {
    // Handle unauthorized
  } else if (error.status === 404) {
    // Handle not found
  }
  // Display error using MUI Alert or Snackbar
}
```

### State Management

- Use React Router's built-in data loading for route data
- Use React Query or SWR for complex caching needs
- Keep local UI state in component state or context

## Common API Endpoints (Conceptual)

These are typical patterns you'll encounter:

- `GET /api/v1/users` - List users
- `GET /api/v1/users/:id` - Get user details
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `GET /api/v1/jobs/:id/status` - Check batch job status
- `GET /api/v1/workflows/:id` - Check workflow status
- `POST /api/v1/workflows/:type/start` - Start a workflow

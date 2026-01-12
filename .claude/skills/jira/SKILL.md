---
name: jira
description: Search, query, find, create, and manage Jira issues. Use when asked to search Jira, find issues, query tickets, look up work items, search for topics in Jira (like "accounts payable"), create user stories, link to epics, or manage Jira content. Use jira-issue.search_issues with JQL to find issues.
---

# Jira Issue Tools

## Overview

This skill enables searching, creating, and managing Jira issues. **API tools work immediately** without additional installation.

## Quick Start: Search Jira

To search for issues on any topic, use the `search_issues` tool with JQL:

```
jira-issue.search_issues(
  jql: 'text ~ "accounts payable" ORDER BY updated DESC'
)
```

### Common Search Patterns

```
# Search by text/keyword
jira-issue.search_issues(jql: 'text ~ "invoice" ORDER BY updated DESC')

# Search in specific project
jira-issue.search_issues(jql: 'project = FIN AND text ~ "budget"')

# Search by status
jira-issue.search_issues(jql: 'status = "In Progress" AND text ~ "API"')

# Search by assignee
jira-issue.search_issues(jql: 'assignee = currentUser() ORDER BY priority DESC')

# Search epics
jira-issue.search_issues(jql: 'type = Epic AND text ~ "reporting"')
```

## Environment Requirements

**Required for API Tools:**
- `JIRA_DOMAIN` - Your Jira domain (e.g., `opengov.atlassian.net`)
- `JIRA_EMAIL` - User email for authentication
- `JIRA_API_TOKEN` - API token for authentication
- `JIRA_STORY_POINTS_FIELD` - (Optional) Custom field ID for story points

## Available API Tools

| Tool | Description |
|------|-------------|
| `search_issues` | **Search issues using JQL** - use this to find/query issues |
| `get_issue` | Get issue details by key or ID |
| `list_epic_issues` | List all issues in an epic |
| `create_user_story` | Create a user story, optionally linked to an epic |
| `get_epic_from_aha_feature` | Extract Jira epic info from Aha! integration fields |
| `add_web_link_to_issue` | Add a web link to an issue |
| `attach_file_to_issue` | Attach a file to an issue |

## Atlassian Command Line Interface (ACLI)

[ACLI](https://www.atlassian.com/blog/jira/atlassian-command-line-interface) is Atlassian's official CLI tool for Jira Cloud. It provides text-based commands for managing Jira directly from the terminal.

### ACLI Capabilities
- Create, clone, and update projects
- Search, edit, transition, archive, and delete work items
- Authenticate and manage user access across Jira sites
- Search and change ownership of dashboards and filters
- Run bulk operations across multiple sites
- Execute scripts in parallel

### ACLI Installation
```bash
# Install for your OS (Windows, Mac, or Linux)
# Follow setup instructions at: https://www.atlassian.com/blog/jira/atlassian-command-line-interface
```

### When to Use ACLI
- **Bulk operations** - Managing many issues at once
- **Scripting** - Automating repetitive Jira tasks
- **Multi-site management** - Operating across multiple Jira sites
- **Terminal workflows** - When you prefer command-line over UI

### ACLI Requirements
- ACLI package installed for your OS
- Atlassian account with appropriate permissions

## Common Patterns

### Create a User Story (API)
```
jira-issue.create_user_story(
  project_key: "SW",
  summary: "Implement invoice validation",
  description: "As a user, I want to validate invoices...",
  epic_key: "SW-123",  // Optional: link to epic
  priority: "High",
  labels: ["invoice", "validation"]
)
```

### Get Issue Details (API)
```
jira-issue.get_issue(issue_key: "SW-456", include_comments: true)
```

### List Issues in an Epic (API)
```
jira-issue.list_epic_issues(epic_key: "SW-123")
jira-issue.list_epic_issues(epic_key: "SW-123", status: "In Progress")
```

### Extract Epic from Aha! Feature (API)
```
// When you have integration_fields from Aha! feature
jira-issue.get_epic_from_aha_feature(
  integration_fields_json: '[{"service_name":"jira","name":"key","value":"SW-123"}]'
)
```

### Search with JQL (API)
```
jira-issue.search_issues(
  jql: 'project = SW AND status = "In Progress" AND assignee = currentUser()'
)
```

### Add Documentation Link (API)
```
jira-issue.add_web_link_to_issue(
  issue_key: "SW-456",
  url: "https://confluence.example.com/page/123",
  title: "Technical Documentation"
)
```

### Attach a File (API)
```
jira-issue.attach_file_to_issue(
  issue_key: "SW-456",
  file_path: "/path/to/requirements.pdf"
)
```

## Response Structure

### Issues include:
- Issue key and ID
- Summary and description
- Type, status, priority
- Assignee and reporter
- Parent/epic information
- Labels and components
- Created/updated dates
- Web URL

### Created issues return:
- New issue key
- Issue ID
- Direct URL to issue

## Key Concepts

### Issue Types
- **Story** - User stories (default for `create_user_story`)
- **Epic** - Parent container for stories
- **Task** - Work items
- **Bug** - Defects

### Linking to Epics
Stories are linked to epics using the `parent` field:
```
epic_key: "SW-123"  // Creates story as child of this epic
```

### Aha! → Jira Integration
When Aha! features are integrated with Jira:
- Features become Jira epics
- Use `get_epic_from_aha_feature` to extract epic key
- Look for `service_name: "jira"` and `name: "key"` in integration_fields

### JQL (Jira Query Language)
Search with powerful queries:
```
project = SW AND status = "In Progress"
parent = SW-123 AND type = Story
labels in ("invoice", "validation") ORDER BY created DESC
```

## Choosing Between ACLI and API Tools

| Use Case | Recommended |
|----------|-------------|
| Single issue operations in workflows | API Tools |
| Bulk updates across projects | ACLI |
| Integration with Aha! features | API Tools |
| Terminal-based automation scripts | ACLI |
| Cross-site operations | ACLI |
| Programmatic integrations | API Tools |

## Tips

1. Use **ACLI** for bulk operations and terminal workflows
2. Use **API tools** for programmatic integrations and Aha! workflows
3. Always use `project_key` when creating issues
4. Extract epic keys from Aha! features using `get_epic_from_aha_feature`
5. JQL queries work with both ACLI and API tools
6. Attach documentation for context with `add_web_link_to_issue`

## References

- [Atlassian CLI Blog Announcement](https://www.atlassian.com/blog/jira/atlassian-command-line-interface)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

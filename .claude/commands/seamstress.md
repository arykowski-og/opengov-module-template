---
description: 🟣 Build OpenGov components (alias for @seamstress agent)
---

# Seamstress Command

Shortcut for invoking the @seamstress agent.

## Usage

```bash
/seamstress {your_request}
```

This is equivalent to: `@seamstress {your_request}`

## Examples

```bash
# Build from Figma
/seamstress build https://figma.com/design/abc123

# Build from prompt
/seamstress build a list view for skills with search and filters

# Build from file
/seamstress build from docs/feature-spec.md

# Create dashboard
/seamstress create a work orders dashboard with metrics
```

## Note

This slash command is a convenience alias. You can also invoke the agent directly:
- `@seamstress build {your_request}`

Both methods work identically.

## Delegation

@seamstress {{user_input}}

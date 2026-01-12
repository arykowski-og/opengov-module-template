# OpenCode Migration Notes - Seamstress Design

## Overview

Seamstress Design now supports **both Claude Code and OpenCode** AI assistants with 100% backward compatibility.

## Migration Approach

### Dual Configuration Strategy

```
seamstress-design/
├── .claude/              # Claude Code configuration (original)
│   ├── agents/
│   │   └── seamstress.md
│   └── skills/          # 11 semantic skills
│
├── .opencode/           # OpenCode configuration (new)
│   ├── agent/
│   │   └── seamstress.md
│   └── skills/          # Same 11 skills, copied
```

## What Was Migrated

### 1. Agent Configuration
- Source: `.claude/agents/seamstress.md`
- Target: `.opencode/agent/seamstress.md`
- Changes: OpenCode-specific frontmatter (`mode: subagent`), tool configuration

### 2. Skills (11 Total)

**Core Skills (1):**
- `seamstress-core-principles`

**Domain Skills (6):**
- `seamstress-routing-patterns`
- `seamstress-business-logic`
- `seamstress-theme-system`
- `seamstress-figma-layout-detection`
- `seamstress-architecture`
- `seamstress-accessibility`

**Pattern Skills (4):**
- `list-view-pattern`
- `form-pattern`
- `detail-view-pattern`
- `dashboard-pattern`

**Documentation:**
- `README.md`
- `LAYOUT_PATTERNS.md`

## Usage Comparison

### Claude Code (Original)
```bash
claude
@seamstress build a skills list page
```

### OpenCode (New)
```bash
opencode
@seamstress build a skills list page
```

**Both generate identical React components!**

## Key Differences from Claude Code

| Aspect | Claude Code | OpenCode |
|--------|-------------|----------|
| Config Location | `.claude/agents/` | `.opencode/agent/` |
| Tools Format | Title-case list | YAML boolean flags |
| Agent Mode | N/A | `mode: subagent` |
| Skills Directory | `.claude/skills/` | `.opencode/skills/` |

## Testing Checklist

- [ ] Launch OpenCode: `opencode`
- [ ] Test invocation: `@seamstress help`
- [ ] Test skills: `@seamstress what are the golden rules?`
- [ ] Test list generation: `@seamstress build a skills list`
- [ ] Test form generation: `@seamstress create an agent form`
- [ ] Verify output matches Claude Code

## Backward Compatibility

✅ **Zero Breaking Changes**

All Claude Code functionality completely unchanged:
```
✓ .claude/agents/seamstress.md     UNCHANGED
✓ .claude/skills/* (all 11)        UNCHANGED
✓ All existing documentation       UNCHANGED
```

## Configuration Updates

When updating Seamstress Design:
1. Update `.claude/` configuration (primary)
2. Sync changes to `.opencode/` (secondary)
3. Test with both AI assistants

## Getting Help

### Documentation
- OpenCode: https://opencode.ai/docs/
- Claude Code: https://docs.claude.com/claude-code/
- This repo README: see updated sections

### Support
- OpenCode Discord: https://discord.gg/opencode
- OpenCode GitHub: https://github.com/opencode-ai/opencode

## Summary

Seamstress Design now supports both Claude Code and OpenCode with identical functionality. Choose the AI assistant that works best for you - both generate the same production-ready OpenGov components!

**🪡 One codebase, two AI assistants, same great experience! ✨**


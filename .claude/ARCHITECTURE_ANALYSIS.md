# Seamstress Architecture Analysis: Distribution Strategy

## 🎯 Core Problem

**Current State:** Confusing dual-purpose setup with symlinks creating maintenance burden and unclear boundaries

**Root Issues:**
1. **Symlinks everywhere** - Commands and skills symlinked from component-library to seamstress-design
2. **Scope confusion** - Unclear when to use component patterns vs. application patterns
3. **Duplicated knowledge** - Theme/token guidance exists in both repos with slightly different focuses
4. **Documentation debt** - Multiple sources of truth across both repos

## 📊 Clear Separation Principle

**Component-Library = WHAT** (Reusable Components)
- Production-ready npm packages
- Composable/Configurable APIs
- Distributed globally via marketplace

**Seamstress-Design = HOW** (Application Patterns)
- React pages for applications
- Entity-scoped routing
- Project-specific patterns

---

## Current State Analysis

### Component-Library Repository

**Location:** `/Users/cbarnes/Projects/component-library/.claude/`

**Purpose:** Global marketplace for building production-ready, reusable npm component packages

**Commands (6 total):**
- `/seamstress-build` - Full component generation workflow
- `/seamstress-stories` - Storybook documentation generation
- `/seamstress-validate` - Production-readiness validation
- `/seamstress-debug` - Systematic troubleshooting
- `/seamstress-tokens` - Design token mapping
- `/seamstress-refactor` - Component modernization

**Skills (5 total):**
- `seamstress-build` - Build component packages from Figma
- `seamstress-stories` - Generate Storybook documentation
- `seamstress-debug` - Debug component package issues
- `seamstress-tokens` - Map design values to tokens
- `seamstress-validate` - Validate production readiness

**Distribution:** Claude Code marketplace via GitHub

---

### Seamstress-Design Repository

**Location:** `/Users/cbarnes/Projects/seamstress-design/.claude/`

**Purpose:** Application prototyping - rapidly build React pages

**Commands:** 6 symlinked from component-library (all `/seamstress-*`)

**Local Skills (13 total):**

**Core (2 skills):**
- `seamstress-core-principles` - Golden rules, validation, anti-patterns
- `seamstress-component-hierarchy` - Import priority, component selection

**Domain (7 skills):**
- `seamstress-routing-patterns` - Entity-scoped routing
- `seamstress-business-logic` - Effect.ts, data fetching
- `seamstress-theme-system` - Theme tokens, styling
- `seamstress-figma-integration` - Design validation, token sync
- `seamstress-figma-layout-detection` - Auto-detect NavBar, generate layouts
- `seamstress-architecture` - System structure
- `seamstress-accessibility` - WCAG 2.1 AA standards

**Patterns (4 skills):**
- `list-view-pattern` - DataGrid lists with search/filters
- `form-pattern` - Create/edit forms
- `detail-view-pattern` - Read-only detail pages
- `dashboard-pattern` - Metrics dashboards

**Symlinked Skills:** 5 from component-library

---

## Gap Analysis

### What's Duplicated?

1. **Theme/Token Knowledge**
   - **component-library**: `seamstress-tokens` - Figma→token mapping for components
   - **seamstress-design**: `seamstress-theme-system` - Application styling patterns
   - **Overlap**: Both explain theme.palette.*, theme.spacing(), token usage

2. **Figma Integration**
   - **component-library**: `seamstress-build` - Figma→component package
   - **seamstress-design**: `seamstress-figma-integration` + `seamstress-figma-layout-detection`
   - **Overlap**: Both parse Figma designs

3. **Validation**
   - **component-library**: `seamstress-validate` - Package validation
   - **seamstress-design**: `seamstress-core-principles` - Page validation
   - **Overlap**: Both enforce design system compliance

### What's Missing?

**In Component-Library:**
- ❌ No application pattern skills (list-view, form, dashboard, detail-view)
- ❌ No routing patterns (entity-scoped routes)
- ❌ No page-level principles (PageHeaderComposable requirement)
- ❌ No layout detection (NavBar, suite layouts)
- ❌ No business logic patterns (Effect.ts, data fetching)
- ❌ No component hierarchy guidance (import priority)

**In Seamstress-Design:**
- ❌ No component refactoring skill (exists only in commands)
- ❌ Limited Storybook guidance for local components
- ❌ No npm package structure guidance

### What Conflicts Exist?

1. **Token Guidance Fragmentation** - No single source of truth
2. **Scope Confusion** - Symlinks suggest dual-purpose, creates cognitive overhead
3. **Documentation Duplication** - Multiple sources of truth, maintenance burden

---

## ✅ Recommended Changes

### Component-Library: Add 2 Skills to Marketplace

**Add:**
1. `seamstress-component-hierarchy` - Import priority rules (OpenGov → MUI → Local)
2. `seamstress-figma-integration` - Design validation and token sync

**Rationale:** These are foundational knowledge useful across all projects

**Updated marketplace.json:**
```json
{
  "name": "opengov-component-library",
  "version": "1.1.0",
  "plugins": [
    {
      "name": "seamstress",
      "version": "1.1.0",
      "commands": {
        "seamstress-build": "./commands/seamstress-build.md",
        "seamstress-stories": "./commands/seamstress-stories.md",
        "seamstress-validate": "./commands/seamstress-validate.md",
        "seamstress-debug": "./commands/seamstress-debug.md",
        "seamstress-tokens": "./commands/seamstress-tokens.md",
        "seamstress-refactor": "./commands/seamstress-refactor.md"
      },
      "skills": [
        "seamstress-build",
        "seamstress-stories",
        "seamstress-validate",
        "seamstress-debug",
        "seamstress-tokens",
        "seamstress-component-hierarchy",
        "seamstress-figma-integration"
      ]
    }
  ]
}
```

---

### Seamstress-Design: Remove All Symlinks

**Remove:**
- ❌ All 6 command symlinks (marketplace makes them auto-available)
- ❌ All 5 skill symlinks (marketplace auto-invokes them)
- ❌ `seamstress-component-hierarchy` (moving to marketplace)
- ❌ `seamstress-figma-integration` (moving to marketplace)

**Keep (11 local skills):**
- ✅ `seamstress-core-principles` (page-level golden rules)
- ✅ `seamstress-routing-patterns` (entity-scoped routes)
- ✅ `seamstress-business-logic` (Effect.ts patterns)
- ✅ `seamstress-theme-system` (application theming)
- ✅ `seamstress-figma-layout-detection` (suite layouts)
- ✅ `seamstress-architecture` (app architecture)
- ✅ `seamstress-accessibility` (WCAG standards)
- ✅ 4 pattern skills (list-view, form, detail-view, dashboard)

**Rationale:**
- Claude Code marketplace automatically makes commands/skills available everywhere
- Symlinks create confusion about which version is active
- Marketplace skills auto-invoke based on keywords
- No manual linking required

**Simplified directory structure:**
```
.claude/
├── README.md                     # Simplified - local skills only
├── settings.json                 # Marketplace reference
└── skills/                       # 11 local skills
    ├── README.md
    ├── core/
    │   └── seamstress-core-principles/
    ├── domain/
    │   ├── seamstress-routing-patterns/
    │   ├── seamstress-business-logic/
    │   ├── seamstress-theme-system/
    │   ├── seamstress-figma-layout-detection/
    │   ├── seamstress-architecture/
    │   └── seamstress-accessibility/
    └── patterns/
        ├── list-view-pattern/
        ├── form-pattern/
        ├── detail-view-pattern/
        └── dashboard-pattern/
```

---

## 🚀 Migration Steps

### Phase 1: Enhance Component-Library Marketplace

```bash
cd /Users/cbarnes/Projects/component-library

# Copy skills from seamstress-design
cp -r ../seamstress-design/.claude/skills/core/seamstress-component-hierarchy .claude/skills/
cp -r ../seamstress-design/.claude/skills/domain/seamstress-figma-integration .claude/skills/

# Update marketplace.json: bump version 1.0.0 → 1.1.0
# Add new skills to the skills array

# Update .claude/skills/README.md with new skills

git add .claude/skills/seamstress-component-hierarchy
git add .claude/skills/seamstress-figma-integration
git add .claude/marketplace.json
git add .claude/skills/README.md
git commit -m "Add component-hierarchy and figma-integration skills to marketplace

- seamstress-component-hierarchy: Import priority rules (OpenGov → MUI → Local)
- seamstress-figma-integration: Design validation and token sync
- Bump marketplace version to 1.1.0
- These foundational skills are now globally available"
git push origin main
```

---

### Phase 2: Simplify Seamstress-Design

```bash
cd /Users/cbarnes/Projects/seamstress-design

# Remove ALL symlinks (marketplace handles distribution)
rm -rf .claude/commands/seamstress-*.md

rm -rf .claude/skills/seamstress-build
rm -rf .claude/skills/seamstress-debug
rm -rf .claude/skills/seamstress-stories
rm -rf .claude/skills/seamstress-tokens
rm -rf .claude/skills/seamstress-validate

# Remove moved skills
rm -rf .claude/skills/core/seamstress-component-hierarchy
rm -rf .claude/skills/domain/seamstress-figma-integration

# Update documentation
# - Simplify .claude/README.md (remove "two contexts" explanation)
# - Update .claude/skills/README.md inventory (11 skills instead of 18)
# - Optionally remove .claude/guidelines.md if redundant

git add -A
git commit -m "Remove marketplace symlinks, rely on plugin installation

- Removed all command and skill symlinks
- Marketplace skills auto-available after plugin installation
- Moved component-hierarchy and figma-integration to marketplace
- Simplified README to focus on local application patterns
- Updated skills inventory: 11 local application-specific skills

Skills now clearly separated:
- Marketplace (7): Component package development
- Local (11): Application page development"
git push origin main
```

---

### Phase 3: Update Plugin Installation

```bash
# Update marketplace to get new skills
/plugin update seamstress

# Verify skills available
# Test: Ask "What are the component hierarchy rules?"
# Should cite seamstress-component-hierarchy from marketplace
```

---

### Phase 4: Validate

**Test Component Development:**
```bash
cd component-library
# Ask: "/seamstress-build [figma-url]"
# Should work as before

# Ask: "What are the import priorities?"
# Should cite seamstress-component-hierarchy skill
```

**Test Application Development:**
```bash
cd seamstress-design
# Ask: "Build a skills list page"
# Should cite list-view-pattern, core-principles, routing-patterns

# Ask: "What token should I use for spacing?"
# Should cite seamstress-theme-system (local) or seamstress-tokens (marketplace)
```

---

## 🎓 Best Practices Going Forward

### Decision Matrix: Marketplace vs. Local?

| Add to Marketplace If | Keep Local If |
|----------------------|---------------|
| ✅ Useful across ALL OpenGov projects | ✅ Application-specific patterns |
| ✅ Component-focused (not page) | ✅ Project structure assumptions |
| ✅ No project-specific assumptions | ✅ Entity-scoped routing (not universal) |
| ✅ Foundational knowledge | ✅ Mock data patterns |

### Never Symlink

**Why symlinks are harmful:**
1. Creates confusion about which version is active
2. Breaks when paths change
3. Marketplace auto-discovery makes them unnecessary
4. Maintenance burden (must update symlinks on marketplace changes)

**Instead:**
- Marketplace commands are globally available after one-time installation
- Skills auto-invoke based on keywords in user requests
- No manual linking required

### Naming Conventions

**Marketplace (component-library):**
- Commands: `seamstress-{action}` (e.g., `seamstress-build`)
- Skills: `seamstress-{topic}` (e.g., `seamstress-tokens`)
- Focus: Component package development
- Prefix: Always "seamstress-" for consistency

**Local (seamstress-design):**
- Core skills: `seamstress-{principle}` (e.g., `seamstress-core-principles`)
- Domain skills: `seamstress-{domain}` (e.g., `seamstress-routing-patterns`)
- Pattern skills: `{pattern}-pattern` (e.g., `list-view-pattern`)
- Focus: Application page development
- Prefix: Mixed (seamstress- for core/domain, -{pattern} for patterns)

### Versioning & Updates

**Marketplace (component-library):**
```json
// .claude/marketplace.json
{
  "version": "1.1.0",  // Semantic versioning
  "plugins": [{
    "version": "1.1.0"  // Keep in sync
  }]
}
```

**Update Process:**
1. Make changes to `.claude/commands/` or `.claude/skills/`
2. Bump version in `.claude/marketplace.json`
3. Commit and push to main branch
4. Users update: `/plugin update seamstress`

**Local Skills (seamstress-design):**
- No version needed (not distributed)
- Changes take effect immediately
- Git tracks changes like normal code

### Consuming Both Contexts

**For New Projects:**

1. **Install Marketplace** (one-time per developer):
```bash
/plugin marketplace add https://github.com/OpenGov/component-library
/plugin install seamstress@opengov-internal
```

2. **Clone Seamstress-Design** (if building application pages):
```bash
git clone git@github.com:OpenGov/seamstress-design.git
cd seamstress-design
```

3. **Usage:**
```
# Component packages (marketplace)
/seamstress-build https://figma.com/...
/seamstress-validate packages/my-component

# Application pages (local skills - automatic)
"Build a skills list page with search"
"Create a form for editing agents"
```

**For Application Repos:**

Add to `.claude/settings.json`:
```json
{
  "extraKnownMarketplaces": [
    {
      "name": "opengov-component-library",
      "source": "https://github.com/OpenGov/component-library"
    }
  ]
}
```

**For Other Teams:**

If another team wants application patterns:
1. Copy relevant skills from seamstress-design `.claude/skills/`
2. Adapt to their project structure
3. Don't symlink - copy and customize

---

## 📐 Final Architecture

```
Developer Environment
├── Marketplace Plugin: seamstress@opengov-internal (one-time install)
│   ├── 6 commands (global) - /seamstress-build, /seamstress-validate, etc.
│   └── 7 skills (global) - Auto-invoked everywhere
│
└── Projects
    ├── component-library/
    │   └── Publishes marketplace (source of truth)
    │
    ├── seamstress-design/
    │   ├── References marketplace (via settings.json)
    │   └── Adds 11 local application skills
    │
    └── other-projects/
        └── Install marketplace plugin → Get all global skills automatically
```

### Integration Model

**Component-Library Marketplace (Global):**
- **Purpose:** Build reusable component packages
- **Distribution:** Claude Code marketplace (Git-based)
- **Contains:** 6 commands, 7 skills
- **Consumers:** All OpenGov projects after one-time installation

**Seamstress-Design Local (Project-Specific):**
- **Purpose:** Build application pages and prototypes
- **Distribution:** Git repository (not marketplace)
- **Contains:** 11 local skills (1 core + 6 domain + 4 patterns)
- **Consumers:** Projects cloning seamstress-design or copying skills

---

## 💡 Key Insights

1. **No symlinks needed** - Marketplace distribution handles global availability
2. **Skills work together** - Marketplace + local skills coexist seamlessly via Claude's discovery
3. **Clear boundaries** - Component packages (marketplace) vs. Application pages (local)
4. **Easy updates** - Bump marketplace version, users run `/plugin update seamstress`
5. **Reduced maintenance** - Single source of truth per skill, no duplicate documentation
6. **Separation of concerns** - Component-Library = WHAT, Seamstress-Design = HOW

---

## Summary

This architecture analysis reveals that the optimal distribution strategy is to:

1. **Enhance the marketplace** with 2 foundational skills (component-hierarchy, figma-integration)
2. **Remove all symlinks** from seamstress-design (marketplace makes them unnecessary)
3. **Keep clear boundaries** between component package development (marketplace) and application page development (local)
4. **Leverage Claude's skill discovery** to automatically invoke the right skills based on context
5. **Reduce maintenance** by eliminating duplicate documentation and version conflicts

The result is a clean, maintainable architecture where:
- **Global knowledge** lives in the marketplace
- **Project-specific patterns** live in local skills
- **No manual linking** is required
- **Updates are easy** through marketplace versioning
- **Developers have clarity** on when to use which context

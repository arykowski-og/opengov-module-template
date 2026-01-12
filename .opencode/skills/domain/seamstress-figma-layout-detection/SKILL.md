---
name: seamstress-figma-layout-detection
description: Automatic detection of OpenGov global navigation components from Figma designs and generation of suite-specific layouts and configurations. Use when building from Figma URLs to create NavBar layouts.
---

# Seamstress Figma Layout Detection & Generation

## Overview
When building from a Figma URL using Seamstress, this skill automatically detects OpenGov global navigation components and creates suite-specific layouts and configurations if they don't already exist.

## Skill Trigger
This skill activates when:
- User requests: "build {figma_url}"
- User requests: "generate from {figma_url}"
- User requests: "create components from {figma_url}"

## Detection Process

### Step 1: Analyze Figma Design for NavBar
When processing a Figma URL, check for OpenGov global navigation:

```typescript
// Look for these indicators in the Figma design:
// 1. Component named "NavBar" or "Navigation" in the design
// 2. @opengov/components-nav-bar visual patterns
// 3. Global navigation structure with menu options
```

### Step 2: Extract Suite Information
If NavBar is detected, extract:
- **Suite Name**: From the appName property or design title (e.g., "Enterprise Asset Management", "Utility Billing")
- **Menu Structure**: Top-level menu items and their routes
- **Route Prefix**: Common path prefix for all routes (e.g., `/eam/`, `/billing/`)

### Step 3: Check for Existing Layout
Search for existing layout files:

```bash
# Check for layout component
find src/components -name "*Layout.tsx" -type f

# Check for nav config
find src/config -name "*NavConfig.ts" -type f
```

Match patterns:
- Layout: `{SuiteName}Layout.tsx` (e.g., `EAMLayout.tsx`, `UtilityBillingLayout.tsx`)
- Nav Config: `{suiteName}NavConfig.ts` (e.g., `eamNavBarConfig.ts`, `utilityBillingNavConfig.ts`)

### Step 4: Create Layout if Missing
If no matching layout exists, generate both files.

## Layout Component Pattern

### File Structure
```
src/components/{SuiteName}Layout.tsx
src/config/{suiteName}NavBarConfig.ts
```

### Layout Component Template
```typescript
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { NavBar } from '@opengov/components-nav-bar';
import {
  SearchDialog,
  SearchResults,
  SearchSuggestions,
  SearchTable,
  SelectableTableItem,
  SelectableTableRow,
  FocusedPreview
} from '@opengov/components-nav-bar';
import { useDebounce } from 'react-use';
import {
  {suiteName}MenuOptions,
  {suiteName}FavoritesData,
  {suiteName}UtilityTrayOptions,
  {suiteName}ThemeMenuSections,
} from '../config/{suiteName}NavBarConfig';
import type { INavBarOptions, IMenuItem, ISubmenuSection } from '../config/navBarTypes';
import { OGAssistModal } from './OGAssist/OGAssistModal';
import { OGAssistProvider } from '../contexts/OGAssistContext';
import { AiOgAssist } from '@opengov/react-capital-assets';
import { useThemeMode } from '../contexts/ThemeContext';

interface {SuiteName}LayoutProps {
  children: React.ReactNode;
}

export function {SuiteName}Layout({ children }: {SuiteName}LayoutProps) {
  const { mode, setThemeMode } = useThemeMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputDebounced, setSearchInputDebounced] = useState('');
  const [searchFilterValue, setSearchFilterValue] = useState('all');
  const [searchResults, setSearchResults] = useState<undefined | SearchResult[]>(undefined);
  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState<undefined | SearchResult>(undefined);
  const [ogAssistOpen, setOgAssistOpen] = useState(false);

  // Debounce the search input
  useDebounce(() => setSearchInputDebounced(searchInput), 200, [searchInput]);

  // Mark active nav link for styling
  React.useEffect(() => {
    const markActiveNavLink = () => {
      const navbar = document.querySelector('[data-test="nav_bar_header"]');
      if (!navbar) return;

      const links = navbar.querySelectorAll('a');
      const currentPath = window.location.pathname;

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        link.classList.remove('active-nav-link');

        const isActive =
          href === currentPath ||
          (href !== '/' && currentPath.startsWith(href));

        if (isActive) {
          link.classList.add('active-nav-link');
        }
      });
    };

    markActiveNavLink();

    const handleNavigation = () => {
      setTimeout(markActiveNavLink, 100);
    };

    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('pushState', handleNavigation);
    window.addEventListener('replaceState', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('pushState', handleNavigation);
      window.removeEventListener('replaceState', handleNavigation);
    };
  }, []);

  const handleGetSubmenuItems = async (menuItem: IMenuItem): Promise<ISubmenuSection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            title: 'Dynamic Section',
            items: [
              {
                label: 'Dynamic Item 1',
                id: 'dynamic-1',
                url: '#',
                shouldFetchNestedMenuItems: false,
              },
            ],
          },
        ]);
      }, 500);
    });
  };

  const handleThemeOptionClick = useCallback((dataOg?: string) => {
    if (dataOg === 'theme_light') {
      setThemeMode('light');
    } else if (dataOg === 'theme_dark') {
      setThemeMode('dark');
    }
  }, [setThemeMode]);

  const navBarOptions: INavBarOptions = {
    appName: '{Suite Display Name}',
    menuOptions: {suiteName}MenuOptions,
    favorites: undefined,
    utilityTrayOptions: {
      ...{suiteName}UtilityTrayOptions,
      helpOptions: {
        muiIcon: mode === 'light' ? DarkModeIcon : LightModeIcon,
        menuSections: {suiteName}ThemeMenuSections.map(section => ({
          ...section,
          menuItems: section.menuItems?.map(item => ({
            ...item,
            onClick: () => handleThemeOptionClick(item.dataOg),
          })),
        })),
      },
      customUtilityOptions: {
        utilityName: 'OG Assist',
        muiIcon: AiOgAssist,
        iconOnClickOverride: () => setOgAssistOpen(true),
        menuSections: [],
      },
    },
    showOfflineIndicator: false,
    getSubmenuItems: handleGetSubmenuItems,
    autoDismissToasts: true,
    loggerOutput: 'console',
  };

  return (
    <OGAssistProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar {...navBarOptions} />

        <OGAssistModal
          open={ogAssistOpen}
          onClose={() => setOgAssistOpen(false)}
        />

        <Box>
          {children}
        </Box>
      </Box>
    </OGAssistProvider>
  );
}
```

## Nav Config Pattern

### Nav Config Template
```typescript
import type {
  IMenuOption,
  IUtilityTrayOptions,
  IFavoritesSection,
  IProfileSettingsOptions,
  UtilityOptions,
} from './navBarTypes';

// Dynamically determine active menu item based on current path
const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

export const {suiteName}MenuOptions: IMenuOption[] = [
  {
    label: 'Dashboard',
    tooltipText: '{Suite} Dashboard',
    id: '{suite}-dashboard',
    url: '/{routePrefix}/dashboard',
    isActive: currentPath === '/{routePrefix}/dashboard',
    shouldFetchNestedMenuItems: false,
  },
  // Add more menu items based on Figma design...
];

export const {suiteName}FavoritesData: IFavoritesSection[] = [];

export const {suiteName}HelpOptions: UtilityOptions = {
  menuSections: [
    {
      menuItems: [
        {
          url: 'https://docs.example.com/{suite}',
          label: '{Suite} Documentation',
          description: 'Browse {suite} guides and documentation',
          openInNewTab: true,
          dataOg: '{suite}_help_center',
        },
        {
          url: '/{routePrefix}/help/guides',
          label: 'Getting Started',
          description: 'Quick start guide',
          openInNewTab: false,
          dataOg: '{suite}_guides',
        },
      ],
    },
  ],
};

export const {suiteName}SettingsOptions: UtilityOptions = {
  badgeVariant: 'dot',
  menuSections: [
    {
      menuItems: [
        {
          url: '/{routePrefix}/settings/general',
          label: 'General Settings',
          description: 'Configure preferences',
          openInNewTab: false,
        },
      ],
    },
  ],
};

export const {suiteName}NotificationsOptions: UtilityOptions = {
  badgeContent: 0,
  menuSections: [
    {
      menuItems: [],
    },
  ],
};

export const {suiteName}ProfileSettingsOptions: IProfileSettingsOptions = {
  profileImgUrl: '',
  placeHolderInitials: 'XX',
  updateProfileUrl: '/{routePrefix}/profile',
  handleSignOut: () => {
    // Implement sign out logic
  },
};

export const {suiteName}ThemeMenuSections = [
  {
    menuItems: [
      {
        url: '#',
        label: 'Light Mode',
        description: 'Switch to light theme',
        openInNewTab: false,
        dataOg: 'theme_light',
      },
      {
        url: '#',
        label: 'Dark Mode',
        description: 'Switch to dark theme',
        openInNewTab: false,
        dataOg: 'theme_dark',
      },
    ],
  },
];

export const {suiteName}UtilityTrayOptions: IUtilityTrayOptions = {
  profileSettingsOptions: {suiteName}ProfileSettingsOptions,
  settingsOptions: {suiteName}SettingsOptions,
  notificationsOptions: {suiteName}NotificationsOptions,
};
```

## Naming Conventions

### Suite Name Transformation
Convert suite display names to code identifiers:

| Display Name | SuiteName (PascalCase) | suiteName (camelCase) | route-prefix |
|-------------|------------------------|----------------------|--------------|
| Enterprise Asset Management | EAM | eam | /eam |
| Utility Billing | UtilityBilling | utilityBilling | /billing |
| Community Development | CommunityDevelopment | communityDevelopment | /community |
| Permitting | Permitting | permitting | /permitting |
| Budget Management | BudgetManagement | budgetManagement | /budget |

**Rules:**
- Remove common words: "System", "Module", "Application"
- Use acronyms for long suite names (e.g., EAM instead of EnterpriseAssetManagement)
- Route prefix is lowercase, kebab-case if needed
- Config file uses camelCase prefix (e.g., `eamNavBarConfig.ts`)
- Layout file uses PascalCase (e.g., `EAMLayout.tsx`)

## Extraction Process

### From Figma Design
1. **AppName**: Extract from NavBar component's appName prop or design title
2. **Menu Items**: Extract from NavBar menu structure
   - Label: Menu item text
   - URL: Derive from label (lowercase, hyphenated)
   - Tooltip: Use label or extract from Figma description
3. **Route Prefix**: Determine from common path in all menu URLs
4. **Submenu Structure**: Extract nested menu items if present

### Example Extraction
```
Figma NavBar Component:
- appName: "Enterprise Asset Management"
- Menu Items:
  - "Dashboard" → /eam/dashboard
  - "Work Orders" → /eam/work-orders
  - "Assets" → /eam/assets
  - "Maintenance" → /eam/maintenance

Generated:
- SuiteName: EAM
- suiteName: eam
- routePrefix: /eam
- Files: EAMLayout.tsx, eamNavBarConfig.ts
```

## Integration with App.tsx

After creating layout and config, update App.tsx routing:

```typescript
// Add lazy import
const {SuiteName}Layout = lazy(() => import('./components/{SuiteName}Layout'));

// Add route section
<Route path="/{routePrefix}/*" element={
  <PageTransition>
    <{SuiteName}Layout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<{SuiteName}Dashboard />} />
        {/* Add more routes based on menu items */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </{SuiteName}Layout>
  </PageTransition>
} />
```

## Validation Checklist

After creating layout and config:
- [ ] Layout component imports NavBar from `@opengov/components-nav-bar`
- [ ] Config file exports all required options (menu, favorites, utility tray)
- [ ] Theme switcher integrated in utility tray
- [ ] OG Assist button included
- [ ] Active nav link styling implemented
- [ ] Route prefix consistent across all URLs
- [ ] App.tsx updated with new route section
- [ ] Layout follows existing patterns (EAMLayout, UtilityBillingLayout)

## Golden Rules

1. **Always check for existing layouts first** - Don't duplicate
2. **Use established naming conventions** - Follow PascalCase/camelCase patterns
3. **Extract menu structure from Figma** - Don't guess routes
4. **Include theme switcher** - Use helpOptions slot for theme toggle
5. **Add OG Assist integration** - Use customUtilityOptions
6. **Follow component hierarchy** - Priority 1: @opengov components
7. **Use theme tokens** - No hardcoded colors or spacing
8. **Entity-scoped routes** - Use /{routePrefix}/{resource} pattern
9. **Active link styling** - Implement markActiveNavLink logic
10. **Update App.tsx** - Add route section for new suite

## Anti-Patterns

❌ **Don't:**
- Create layouts without checking for existing ones
- Hardcode suite names - extract from Figma
- Skip the nav config file - both files required
- Forget to update App.tsx routing
- Use generic names like "Layout.tsx"
- Mix naming conventions (e.g., EAM in layout but billing in config)
- Skip theme switcher or OG Assist integration
- Create routes that don't match menu items

## Examples

### Example 1: Creating EAM Suite Layout
```bash
# User request
"build https://www.figma.com/design/xyz123/EAM-Dashboard"

# Detection
✓ NavBar found with appName: "Enterprise Asset Management"
✓ Menu items: Dashboard, Work Orders, Assets, Maintenance, Inventory, Reports
✓ Route prefix: /eam

# Check existing
$ find src/components -name "*Layout.tsx"
> EAMLayout.tsx found!
> Using existing EAMLayout.tsx

# Result
Using existing layout: EAMLayout.tsx with eamNavBarConfig.ts
```

### Example 2: Creating New Budget Suite
```bash
# User request
"build https://www.figma.com/design/abc789/Budget-Management"

# Detection
✓ NavBar found with appName: "Budget Management"
✓ Menu items: Dashboard, Budgets, Forecasts, Reports, Administration
✓ Route prefix: /budget

# Check existing
$ find src/components -name "*Budget*Layout.tsx"
> No matching layout found

# Create files
Creating BudgetManagementLayout.tsx
Creating budgetManagementNavBarConfig.ts

# Update routing
Adding route section to App.tsx for /budget/*
```

## Success Criteria

Layout and config creation successful when:
1. ✅ Files created in correct locations
2. ✅ Naming follows conventions
3. ✅ All exports present in config
4. ✅ NavBar renders with correct menu items
5. ✅ Theme switcher works
6. ✅ OG Assist button present
7. ✅ Routes accessible in App.tsx
8. ✅ Active link styling functional
9. ✅ No TypeScript errors
10. ✅ Follows Seamstress core principles

## Skill Citation

When using this skill, cite it as:
```
Using skill: seamstress-figma-layout-detection
Creating layout for {Suite Name} based on Figma design
```

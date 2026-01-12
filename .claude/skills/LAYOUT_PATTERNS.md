# OpenGov Layout Patterns - Quick Reference

## File Structure
Every OpenGov suite needs two files:

```
src/components/{SuiteName}Layout.tsx       # Layout component with NavBar
src/config/{suiteName}NavBarConfig.ts      # Navigation configuration
```

## Existing Layouts

| Suite | Layout File | Config File | Route Prefix |
|-------|------------|-------------|--------------|
| Enterprise Asset Management | `EAMLayout.tsx` | `eamNavBarConfig.ts` | `/eam` |
| Utility Billing | `UtilityBillingLayout.tsx` | `utilityBillingNavConfig.ts` | `/billing` |
| Seamstress Documentation | `SeamstressLayout.tsx` | `seamstressNavConfig.ts` | `/seamstress` |

## Naming Conventions

### Display Name → Code Identifiers

```javascript
// Example: "Enterprise Asset Management"
{
  displayName: "Enterprise Asset Management",
  acronym: "EAM",                           // Use for long names
  pascalCase: "EAM",                        // For layout component
  camelCase: "eam",                         // For config file
  routePrefix: "/eam",                      // For URL paths
  layoutFile: "EAMLayout.tsx",
  configFile: "eamNavBarConfig.ts"
}

// Example: "Utility Billing"
{
  displayName: "Utility Billing",
  pascalCase: "UtilityBilling",             // For layout component
  camelCase: "utilityBilling",              // For config file
  routePrefix: "/billing",                  // For URL paths
  layoutFile: "UtilityBillingLayout.tsx",
  configFile: "utilityBillingNavConfig.ts"
}
```

### Rules:
1. **Acronyms for long names**: "Enterprise Asset Management" → EAM (not EnterpriseAssetManagement)
2. **Remove filler words**: "System", "Module", "Application" are omitted
3. **Route prefix**: Lowercase, shortest meaningful path
4. **Config prefix**: camelCase version of suite name
5. **Layout name**: PascalCase, ends with "Layout"

## Layout Component Pattern

### Required Imports
```typescript
import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { NavBar } from '@opengov/components-nav-bar';
import { OGAssistModal } from './OGAssist/OGAssistModal';
import { OGAssistProvider } from '../contexts/OGAssistContext';
import { AiOgAssist } from '@opengov/react-capital-assets';
import { useThemeMode } from '../contexts/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
```

### Required Config Imports
```typescript
import {
  {suiteName}MenuOptions,
  {suiteName}FavoritesData,
  {suiteName}UtilityTrayOptions,
  {suiteName}ThemeMenuSections,
} from '../config/{suiteName}NavBarConfig';
```

### Component Structure
```typescript
export function {SuiteName}Layout({ children }: {SuiteName}LayoutProps) {
  // 1. Theme mode hook
  const { mode, setThemeMode } = useThemeMode();

  // 2. OG Assist state
  const [ogAssistOpen, setOgAssistOpen] = useState(false);

  // 3. Active nav link effect
  React.useEffect(() => {
    // Mark active nav link for styling
  }, []);

  // 4. Theme toggle handler
  const handleThemeOptionClick = useCallback((dataOg?: string) => {
    if (dataOg === 'theme_light') setThemeMode('light');
    else if (dataOg === 'theme_dark') setThemeMode('dark');
  }, [setThemeMode]);

  // 5. NavBar options
  const navBarOptions: INavBarOptions = {
    appName: '{Suite Display Name}',
    menuOptions: {suiteName}MenuOptions,
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
  };

  // 6. Render
  return (
    <OGAssistProvider>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <NavBar {...navBarOptions} />
        <OGAssistModal open={ogAssistOpen} onClose={() => setOgAssistOpen(false)} />
        <Box>{children}</Box>
      </Box>
    </OGAssistProvider>
  );
}
```

## Nav Config Pattern

### Required Exports
Every nav config must export:

1. **Menu Options** (IMenuOption[])
```typescript
export const {suiteName}MenuOptions: IMenuOption[] = [
  {
    label: 'Dashboard',
    tooltipText: '{Suite} Dashboard',
    id: '{suite}-dashboard',
    url: '/{routePrefix}/dashboard',
    isActive: currentPath === '/{routePrefix}/dashboard',
    shouldFetchNestedMenuItems: false,
  },
  // More menu items...
];
```

2. **Favorites Data** (IFavoritesSection[])
```typescript
export const {suiteName}FavoritesData: IFavoritesSection[] = [];
```

3. **Utility Tray Options** (IUtilityTrayOptions)
```typescript
export const {suiteName}UtilityTrayOptions: IUtilityTrayOptions = {
  profileSettingsOptions: {suiteName}ProfileSettingsOptions,
  settingsOptions: {suiteName}SettingsOptions,
  notificationsOptions: {suiteName}NotificationsOptions,
};
```

4. **Theme Menu Sections**
```typescript
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
```

5. **Profile Settings**
```typescript
export const {suiteName}ProfileSettingsOptions: IProfileSettingsOptions = {
  profileImgUrl: '',
  placeHolderInitials: 'XX',
  updateProfileUrl: '/{routePrefix}/profile',
  handleSignOut: () => {
    // Implement sign out logic
  },
};
```

6. **Settings Options**
```typescript
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
```

7. **Notifications Options**
```typescript
export const {suiteName}NotificationsOptions: UtilityOptions = {
  badgeContent: 0,
  menuSections: [
    {
      menuItems: [],
    },
  ],
};
```

8. **Help Options**
```typescript
export const {suiteName}HelpOptions: UtilityOptions = {
  menuSections: [
    {
      menuItems: [
        {
          url: 'https://docs.example.com/{suite}',
          label: '{Suite} Documentation',
          description: 'Browse {suite} guides',
          openInNewTab: true,
          dataOg: '{suite}_help_center',
        },
      ],
    },
  ],
};
```

## App.tsx Integration

### Add Lazy Import
```typescript
const {SuiteName}Layout = lazy(() => import('./components/{SuiteName}Layout'));
```

### Add Route Section
```typescript
<Route path="/{routePrefix}/*" element={
  <PageTransition>
    <{SuiteName}Layout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PageTransition><{SuiteName}Dashboard /></PageTransition>} />
        {/* Add more routes based on menu items */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </{SuiteName}Layout>
  </PageTransition>
} />
```

## Required Features Checklist

Every layout must include:

- [ ] NavBar from `@opengov/components-nav-bar`
- [ ] Theme switcher in utility tray (using helpOptions slot)
- [ ] OG Assist integration (customUtilityOptions)
- [ ] Active nav link styling logic
- [ ] OGAssistProvider wrapper
- [ ] Theme mode from useThemeMode hook
- [ ] Proper TypeScript types from navBarTypes
- [ ] All 8 config exports (menu, favorites, utility tray, etc.)
- [ ] Consistent route prefix across all URLs
- [ ] Profile settings with sign out handler

## Active Link Styling Logic

Every layout needs this effect:

```typescript
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
```

## Common Menu Item Patterns

### Dashboard (Always First)
```typescript
{
  label: 'Dashboard',
  tooltipText: '{Suite} Dashboard',
  id: '{suite}-dashboard',
  url: '/{routePrefix}/dashboard',
  isActive: currentPath === '/{routePrefix}/dashboard',
  shouldFetchNestedMenuItems: false,
}
```

### List View (with submenu)
```typescript
{
  label: 'Work Orders',
  tooltipText: 'Manage Work Orders',
  id: '{suite}-work-orders',
  url: '/{routePrefix}/work-orders',
  isActive: currentPath.includes('/{routePrefix}/work-orders'),
  shouldFetchNestedMenuItems: true,
  submenuSections: [
    {
      title: 'Work Order Management',
      items: [
        {
          id: 'work-order-list',
          label: 'All Work Orders',
          url: '/{routePrefix}/work-orders',
        },
        {
          id: 'work-order-new',
          label: 'Create Work Order',
          url: '/{routePrefix}/work-orders/new',
        },
      ],
    },
  ],
}
```

### Reports (Always Near End)
```typescript
{
  label: 'Reports',
  tooltipText: 'Analytics & Reports',
  id: '{suite}-reports',
  url: '/{routePrefix}/reports',
  isActive: currentPath.includes('/{routePrefix}/reports'),
  shouldFetchNestedMenuItems: false,
}
```

### Administration (Always Last)
```typescript
{
  label: 'Administration',
  tooltipText: 'System Administration',
  id: '{suite}-admin',
  url: '/{routePrefix}/admin',
  isActive: currentPath.includes('/{routePrefix}/admin'),
  shouldFetchNestedMenuItems: true,
  submenuSections: [
    {
      title: 'Configuration',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          url: '/{routePrefix}/admin/settings',
        },
      ],
    },
  ],
}
```

## Golden Rules

1. **Always check for existing layouts first** - Don't duplicate
2. **Follow naming conventions exactly** - PascalCase for components, camelCase for configs
3. **Include all required exports** - 8 exports minimum in config file
4. **Use consistent route prefix** - Same prefix across all URLs
5. **Theme switcher required** - Use helpOptions slot, not separate utility
6. **OG Assist required** - Always include customUtilityOptions
7. **Active link styling required** - Use the standard effect code
8. **Profile settings required** - Include sign out handler
9. **Update App.tsx** - Add lazy import and route section
10. **Test navigation** - Ensure all menu items work and highlight correctly

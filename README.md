# OpenGov Module Template

A modern [React Router 7](https://reactrouter.com) + [Vite](https://vitejs.dev) starter template using OpenGov's Capital Design System.

## Prerequisites

This template uses OpenGov's private npm packages. You'll need to configure your npm credentials:

1. Get your NPM auth token from [OpenGov's guide](https://opengovinc.atlassian.net/wiki/spaces/DEV/pages/2679408319/Getting+and+configuring+NPM+access)
2. Add it to your `~/.npmrc`:

```
//registry.npmjs.org/:_authToken=npm_YOUR_TOKEN_HERE
```

## Getting Started

Install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Project Structure

```
├── app/
│   ├── components/         # Reusable components
│   │   ├── GlobalNav.tsx   # Navigation bar
│   │   ├── Hero.tsx        # Page hero section
│   │   ├── MuiProvider.tsx # MUI theme provider
│   │   ├── QuickActionCard.tsx
│   │   └── QuickActionCards.tsx
│   ├── routes/             # Route components
│   │   └── home.tsx        # Home page
│   ├── root.tsx            # Root layout
│   └── routes.ts           # Route configuration
├── public/                 # Static assets
├── react-router.config.ts
├── vite.config.ts
└── package.json
```

## Features

- ⚡️ **Vite** - Lightning fast HMR and optimized builds
- 🚀 **React Router 7** - File-based routing with SSR support
- 🎨 **OpenGov Capital Design System** - MUI-based component library
- 📝 **TypeScript** - Type safety out of the box
- 🔍 **ESLint** - Code linting configured

## Key Dependencies

- `@opengov/capital-mui-theme` - OpenGov's MUI theme
- `@opengov/components-nav-bar` - Global navigation component
- `@mui/material` - Material UI components
- `react-router` - React Router v7

## Customizing Your Module

### 1. Update the App Name
In `app/components/GlobalNav.tsx`, change the `appName` prop to your module's name:
```tsx
<NavBar appName="Your Module Name" ... />
```

### 2. Configure Navigation
Update the `menuOptions` array in `GlobalNav.tsx` to define your module's navigation structure.

### 3. Add Quick Actions
Modify `app/components/QuickActionCards.tsx` to add relevant quick action cards for your module.

### 4. Update Home Page
Customize `app/routes/home.tsx` with your module's dashboard content.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## Learn More

- [React Router Documentation](https://reactrouter.com/start/framework/installation)
- [Material UI Documentation](https://mui.com)
- [OpenGov Capital Design System](https://storybook.development.opengov.zone/capital-mui-storybook/)


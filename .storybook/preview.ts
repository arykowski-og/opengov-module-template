import type { Preview } from '@storybook/react-vite'

import { ThemeProvider, CssBaseline } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { createSeamstressTheme } from '../src/theme';

// Create light and dark themes using Seamstress theme configuration
const seamstressLightTheme = createSeamstressTheme('light');
const seamstressDarkTheme = createSeamstressTheme('dark');

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  decorators: [withThemeFromJSXProvider({
    GlobalStyles: CssBaseline,
    Provider: ThemeProvider,
    themes: {
      'Capital Light': seamstressLightTheme,
      'Capital Dark': seamstressDarkTheme,
    },
    defaultTheme: 'Capital Light',
  })]
};

export default preview;
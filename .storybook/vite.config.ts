import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      // NOTE: These aliases are for local development when working with the OpenGov component library.
      // Comment them out when not actively developing against a local component-library-x checkout.
      // Uncomment and adjust paths if you need to test local component library changes:
      // '@opengov/capital-mui-theme': path.resolve(__dirname, '../component-library-x/applications/capital-mui-theme/dist'),
      // '@opengov/react-capital-assets': path.resolve(__dirname, '../component-library-x/packages/react-capital-assets/dist/index.es.js'),
      // '@opengov/capital-assets': path.resolve(__dirname, '../component-library-x/packages/capital-assets/dist'),
      // '@opengov/psc-react-logger': path.resolve(__dirname, '../component-library-x/packages/psc-react-logger/dist/index.js'),
      // '@opengov/capital-design-tokens': path.resolve(__dirname, '../component-library-x/packages/capital-design-tokens/dist'),
      // '@opengov/components-nav-bar': path.resolve(__dirname, '../component-library-x/applications/components-nav-bar/dist'),
    }
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    commonjsOptions: {
      include: [/node_modules/, /component-library-x/],
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: [
      'prop-types',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled'
    ],
    force: true
  }
});
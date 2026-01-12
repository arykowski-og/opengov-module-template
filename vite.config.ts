import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
    // Dedupe MUI packages to avoid multiple instances
    dedupe: [
      "@mui/material",
      "@mui/system",
      "@mui/utils",
      "@mui/styled-engine",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  server: {
    allowedHosts: true,
  },
  ssr: {
    noExternal: [
      // MUI v6 has ESM resolution issues, so we bundle them in both dev and prod.
      // See https://github.com/remix-run/react-router/issues/12982
      "@mui/system",
      "@mui/material",
      "@mui/icons-material",
      "@mui/utils",
      "@mui/styled-engine",
      "@mui/lab",
      // OpenGov packages and their nested dependencies
      "@opengov/capital-mui-theme",
      "@opengov/react-capital-assets",
      "@opengov/components-nav-bar",
      "@opengov/capital-assets",
      "@opengov/components-page-header",
      "@opengov/components-drawer",
      "@opengov/components-modal",
      "@opengov/components-pagination",
      "@opengov/components-result",
      "@opengov/components-file-management",
      "@opengov/components-ai-patterns",
      // Handle all nested MUI packages from @opengov packages
      /^@opengov\/.*\/node_modules\/@mui\/.*/,
    ],
  },
  build: {
    target: "es2022",
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/utils",
      "@mui/styled-engine",
      "@opengov/capital-mui-theme",
      "@opengov/react-capital-assets",
      "@opengov/components-nav-bar",
    ],
    entries: ["app/**/*.{ts,tsx}"],
  },
});

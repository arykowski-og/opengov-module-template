import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import { MuiProvider } from "./components/MuiProvider";
import GlobalNav from "./components/GlobalNav";
import { Box, Container, Typography } from "@mui/material";
import { capitalDesignTokens } from "@opengov/capital-mui-theme";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="emotion-insertion-point" content="" />
        <Meta />
        <Links />
      </head>
      <body style={{ margin: 0 }}>
        <MuiProvider>{children}</MuiProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          top: 0,
          position: "sticky",
          width: "100%",
          backgroundColor: "white",
          zIndex: 999,
        }}
      >
        <GlobalNav />
      </Box>
      <Container
        maxWidth={false}
        sx={{ height: "100%", paddingX: "0px !important", flex: 1 }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <MuiProvider>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: capitalDesignTokens.foundations.colors.gray50,
          p: 4,
        }}
      >
        <Box sx={{ maxWidth: 600, textAlign: "center" }}>
          <Typography variant="h1" color="error" gutterBottom>
            {message}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {details}
          </Typography>
          {stack && (
            <Box
              component="pre"
              sx={{
                textAlign: "left",
                bgcolor: capitalDesignTokens.foundations.colors.gray100,
                p: 2,
                borderRadius: 1,
                fontSize: "0.75rem",
                overflow: "auto",
                maxHeight: 300,
              }}
            >
              {stack}
            </Box>
          )}
        </Box>
      </Box>
    </MuiProvider>
  );
}


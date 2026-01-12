import { ThemeProvider, CssBaseline } from "@mui/material";
import { capitalMuiTheme } from "@opengov/capital-mui-theme";
import { PropsWithChildren } from "react";

export function MuiProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={capitalMuiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}


import { Box, Stack, Typography, Card, CardContent, Grid } from "@mui/material";
import { capitalDesignTokens } from "@opengov/capital-mui-theme";
import type { Route } from "./+types/home";
import Hero from "../components/Hero";
import QuickActionCards from "../components/QuickActionCards";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Module - Home" },
    { name: "description", content: "OpenGov Module Application" },
  ];
}

export default function Home() {
  return (
    <>
      <Hero title="Welcome" />
      <Box sx={{ bgcolor: capitalDesignTokens.foundations.colors.gray50 }}>
        <QuickActionCards />
        <Box sx={{ px: { xs: 2, sm: 4 }, pb: 4 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Workspace
          </Typography>
          <Stack spacing={4}>
            {/* Metric Cards */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetricCard title="Total Records" value="1,234" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetricCard title="Active Items" value="567" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetricCard title="Pending Actions" value="89" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <MetricCard title="Completed Today" value="42" />
              </Grid>
            </Grid>

            {/* Placeholder Section */}
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Recent Activity
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  This is a placeholder section. Customize this template to build your
                  OpenGov module application.
                </Typography>
              </CardContent>
            </Card>

            {/* Another Placeholder Section */}
            <Card>
              <CardContent>
                <Typography variant="h3" gutterBottom>
                  Tasks in Progress
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  No tasks currently in progress.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Box>
    </>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h2" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}


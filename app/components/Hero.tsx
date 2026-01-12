import { Box, Stack, Typography } from "@mui/material";
import { capitalDesignTokens } from "@opengov/capital-mui-theme";

interface Props {
  title: string;
}

export default function Hero({ title }: Props) {
  return (
    <Box
      component="section"
      sx={{
        borderBottom: `1px solid ${capitalDesignTokens.foundations.colors.gray300}`,
      }}
    >
      <Stack direction="row" sx={{ p: 3 }}>
        <Typography variant="h1">{title}</Typography>
      </Stack>
    </Box>
  );
}


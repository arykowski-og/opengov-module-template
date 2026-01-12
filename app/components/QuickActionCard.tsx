import { Box, Card, CardActionArea, Stack, SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { capitalDesignTokens } from "@opengov/capital-mui-theme";
import { Link } from "react-router";
import { SVGProps } from "react";

const {
  foundations: {
    colors: { gray300, white },
  },
  semanticColors: {
    background: { actionLight },
    interaction: { selectionHeavy },
  },
} = capitalDesignTokens;

const FlexBox = styled(Box)({
  flex: "1 1 0",
  minWidth: 200,
});

const HoverableCard = styled(Card)(() => ({
  height: 72,
  display: "flex",
  borderRadius: "8px",
  borderColor: gray300,
  backgroundColor: white,
  transition: "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
  borderWidth: "1px",
  "&:hover": {
    backgroundColor: actionLight,
    borderColor: selectionHeavy,
  },
}));

const CardArea = styled(CardActionArea)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-start",
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(4),
}));

const NoUnderlineLink = styled(Link)({
  textDecoration: "none",
  color: "inherit",
});

interface Props {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  url: string;
}

export default function QuickActionCard({ icon: Icon, label, url }: Props) {
  return (
    <FlexBox>
      <NoUnderlineLink to={url}>
        <HoverableCard variant="outlined">
          <CardArea>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <SvgIcon component={Icon} inheritViewBox color="primary" />
              <Typography variant="h4" color="primary">
                {label}
              </Typography>
            </Stack>
          </CardArea>
        </HoverableCard>
      </NoUnderlineLink>
    </FlexBox>
  );
}


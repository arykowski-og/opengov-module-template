import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { capitalDesignTokens } from "@opengov/capital-mui-theme";
import QuickActionCard from "./QuickActionCard";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const {
  foundations: {
    colors: { gray50 },
  },
} = capitalDesignTokens;

const PaddedRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  gap: theme.spacing(2),
  backgroundColor: gray50,
  padding: theme.spacing(4),
  paddingTop: theme.spacing(5),
  flexWrap: "wrap",
}));

export default function QuickActionCards() {
  return (
    <PaddedRow>
      <QuickActionCard
        icon={DashboardOutlinedIcon}
        label="View Dashboard"
        url="/dashboard"
      />
      <QuickActionCard
        icon={FolderOutlinedIcon}
        label="Browse Records"
        url="/records"
      />
      <QuickActionCard
        icon={AssessmentOutlinedIcon}
        label="View Reports"
        url="/reports"
      />
      <QuickActionCard
        icon={SettingsOutlinedIcon}
        label="Manage Settings"
        url="/settings"
      />
      <QuickActionCard
        icon={AddCircleOutlineIcon}
        label="Create New"
        url="/create"
      />
    </PaddedRow>
  );
}


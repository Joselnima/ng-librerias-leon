import { CardProps } from "@mui/material";

export interface PanelCardProps extends CardProps {
    headerContent?: React.ReactNode;
    subheaderContent?: React.ReactNode;
    media?: React.ReactNode;
    body?: React.ReactNode;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
}
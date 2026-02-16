import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    CardMedia,
    Divider,
    Box,
} from "@mui/material";

import { PanelCardProps } from "./interface/panel-card-props.interface";

export const PanelCard: React.FC<PanelCardProps> = ({
    headerContent,
    subheaderContent,
    media,
    body,
    actions,
    variant = "outlined",
    footer,
    ...cardProps
}) => {
    const hasHeaderSection = headerContent || subheaderContent;

    return (
        <Card
            variant={variant}
            sx={{ borderRadius: 3 }}
            {...cardProps}
        >
            {/* HEADER */}
            {hasHeaderSection && (
                <CardHeader
                    title={headerContent}
                    subheader={subheaderContent}
                    sx={{ pb: 0.5 }}
                />
            )}

            {hasHeaderSection && <Divider />}

            {/* MEDIA */}
            {media && (
                <>
                    <CardMedia sx={{ maxHeight: 300, overflow: "hidden" }}>
                        {media}
                    </CardMedia>
                    <Divider />
                </>
            )}

            {/* BODY */}
            {body && (
                <CardContent>
                    {body}
                </CardContent>
            )}

            {/* ACTIONS */}
            {actions && (
                <>
                    <Divider />
                    <CardActions>{actions}</CardActions>
                </>
            )}

            {/* FOOTER */}
            {footer && (
                <>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        {footer}
                    </Box>
                </>
            )}
        </Card>
    );
};

export default PanelCard;
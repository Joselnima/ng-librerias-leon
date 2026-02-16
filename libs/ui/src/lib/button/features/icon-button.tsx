"use client";

import { IconButton, CircularProgress } from "@mui/material";
import { ButtonIconProps } from "../interfaces/icon-button.interface";

export const ButtonIcon: React.FC<ButtonIconProps> = ({
    icon,
    size = 'medium',
    color = 'primary',
    loading = false,
    disabled = false,
    onClick,
    content, // Destructure but don't use
    ...rest
}) => {


    const isBlocked: boolean = loading || disabled;

    return (
        <IconButton
            type="button"
            size={size}
            color={color}
            onClick={!isBlocked ? (e: any) => {
                e.stopPropagation();
                onClick?.(e)
            } : undefined}
            disabled={isBlocked}
            sx={{
                ...rest.sx,
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                pointerEvents: isBlocked ? 'none' : 'auto',
                opacity: isBlocked ? 0.7 : 1,
            }}
            {...rest}
        >
            {loading ? <CircularProgress size={20} color="inherit" /> : icon}
        </IconButton>
    )

}

export default ButtonIcon;
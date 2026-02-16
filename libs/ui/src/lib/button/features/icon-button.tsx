"use client";

import { IconButton } from "@mui/material";
import { ButtonIconProps } from "../interfaces/icon-button.interface";

export const ButtonIcon: React.FC<ButtonIconProps> = ({
    icon,
    size = 'medium',
    color = 'primary',
    loading = false,
    disabled = false,
    onClick,
    ...rest
}) => {

    const isBlocked: boolean = loading || disabled;

    return (
        <IconButton
            size={size}
            color={color}
            onClick={!isBlocked ? (e) => {
                e.stopPropagation();
                onClick?.(e)
            } : undefined}
            loading={loading}
            disabled={isBlocked}
            sx={{
                ...rest.sx,
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                pointerEvents: isBlocked ? 'none' : 'auto',
                opacity: isBlocked ? 0.7 : 1,
            }}
            {...rest}
        >
            {icon}
        </IconButton>
    )
}

export default ButtonIcon;
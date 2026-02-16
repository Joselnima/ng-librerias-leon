"use client";

import React from 'react';

// Components MUI:
import { Button, Box, CircularProgress } from '@mui/material';

// Interfaces:
import { BasicButtonProps } from '../interfaces/basic-button.interface';

export const BasicButton: React.FC<BasicButtonProps> = ({
    size = 'medium',
    color = 'primary',
    variant = 'contained',
    label = '',
    icon = null,
    iconPosition = 'start',
    fullWidth = false,
    onClick = () => { },
    disabled = false,
    loading = false,
    type = 'button',
    ...rest
}) => {

    const spinner = <CircularProgress size={20} color="inherit" />;

    const isBlocked: boolean = loading || disabled;

    // Si hay ícono, reemplaza por spinner
    let iconProps = {};
    if (icon && iconPosition === 'start') {
        iconProps = { startIcon: loading ? spinner : icon };
    } else if (icon && iconPosition === 'end') {
        iconProps = { endIcon: loading ? spinner : icon };
    }

    const renderContent = () => {
        if (iconPosition === 'center') {
            return (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    {loading ? spinner : icon}
                    {label && <span>{label}</span>}
                </Box>
            );
        }

        if (!icon && label) {
            return (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    {loading && spinner}
                    <span>{label}</span>
                </Box>
            );
        }

        return <span>{label}</span>;
    };

    return (
        <Button
            size={size}
            {...(color ? { color } : {})}
            variant={variant}
            fullWidth={fullWidth}
            type={type}
            onClick={isBlocked ? undefined : onClick}
            sx={{
                ...rest.sx,
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                pointerEvents: isBlocked ? 'none' : 'auto',
                opacity: isBlocked ? 0.7 : 1,
            }}
            {...iconProps}
            {...rest}
        >
            {renderContent()}
        </Button>
    );
};

export default BasicButton;
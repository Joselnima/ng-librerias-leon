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
    content = '',
    fullWidth = false,
    onClick = () => { },
    disabled = false,
    loading = false,
    type = 'button',
    ...rest
}) => {

    const spinner = <CircularProgress size={20} color="inherit" />;
    const isBlocked: boolean = loading || disabled;

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
                textTransform: 'none'
            }}
            {...rest}
        >
            {loading ? (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                    {spinner}
                    {content}
                </Box>
            ) : content}
        </Button>
    );
};


export default BasicButton;
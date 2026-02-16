"use client";

import React from 'react';

// Components MUI:
import { Fab, CircularProgress } from '@mui/material';

// Interfaces:
import { FloatingButtonProps } from '../interfaces/floating-button.interface';

const positionStyles: Record<string, React.CSSProperties> = {
  'bottom-right': { position: 'fixed', bottom: 16, right: 16 },
  'bottom-left': { position: 'fixed', bottom: 16, left: 16 },
  'top-right': { position: 'fixed', top: 16, right: 16 },
  'top-left': { position: 'fixed', top: 16, left: 16 },
};

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  icon,
  content,
  onClick,
  position = 'bottom-right',
  color = 'primary',
  size = 'medium',
  variant = 'circular',
  loading = false,
  disabled = false,
  type = 'button',
  ...rest
}) => {

  const isBlocked: boolean = loading || disabled;

  return (
    <Fab
      type={type}
      color={color}
      size={size}
      variant={variant}
      onClick={!isBlocked ? onClick : undefined}
      sx={{
        ...positionStyles[position],
        cursor: isBlocked ? 'not-allowed' : 'pointer',
        pointerEvents: isBlocked ? 'none' : 'auto',
        opacity: isBlocked ? 0.7 : 1,
        ...rest.sx,
      }}
      {...rest}
    >
      {loading ? (
        <CircularProgress color="inherit" size={24} />
      ) : (
        <>
          {icon}
          {variant === 'extended' && content && (
            <span style={{ marginLeft: 8 }}>{content}</span>
          )}
        </>
      )}
    </Fab>
  );

}


export default FloatingButton;
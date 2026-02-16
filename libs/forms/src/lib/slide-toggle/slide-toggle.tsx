import React from 'react';
import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Switch
} from '@mui/material';

import type { SlideToggleProps } from './interfaces/slide-toggle-props.interface';

export const SlideToggle: React.FC<SlideToggleProps> = ({
  label,
  checked,
  onChange,
  errorText,
  customClass = '',
  size = 'medium',
  color = 'primary',
  labelPlacement = 'end',
  ...rest
}) => {
  return (
    <FormGroup className={customClass}>
      <FormControlLabel
        labelPlacement={labelPlacement}
        control={
          <Switch
            checked={!!checked}
            onChange={(e, val) => onChange?.(e, val)}
            size={size}
            color={color}
            {...rest}
          />
        }
        label={label}
      />
      {!!errorText && (
        <FormHelperText sx={{ color: 'error.main', ml: 1.5 }}>
          {errorText}
        </FormHelperText>
      )}
    </FormGroup>
  );
};

export default SlideToggle;
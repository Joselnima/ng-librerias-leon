import React from 'react';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';

import type { CheckProps } from './interface/check.interface';

export const CheckBox: React.FC<CheckProps> = ({
  label,
  checked,
  onChange,
  errorText,
  customClass = '',
  size = 'medium',
  color = 'secondary',
  labelPlacement = 'end',
  ...rest
}: CheckProps) => {
  return (
    <FormGroup className={customClass}>
      <FormControlLabel
        labelPlacement={labelPlacement}
        control={
          <Checkbox
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

export default CheckBox;
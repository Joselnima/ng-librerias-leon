import React from 'react';
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material';

import type { RadioButtonProps } from './interface/radio-button-props.interface';

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  value,
  onChange,
  options,
  customClass = '',
  errorText = '',
  color = 'primary',
  size = 'medium',
  labelPlacement = 'end',
  labelPosition = 'top',
  row = true,
  ...rest
}) => {

  let flexDirection: React.CSSProperties['flexDirection'] = 'column';
  let labelOrder = 0;
  let groupOrder = 1;

  if (labelPosition === 'bottom') {
    flexDirection = 'column';
    labelOrder = 1;
    groupOrder = 0;
  } else if (labelPosition === 'left') {
    flexDirection = 'row';
    labelOrder = 0;
    groupOrder = 1;
  } else if (labelPosition === 'right') {
    flexDirection = 'row';
    labelOrder = 1;
    groupOrder = 0;
  }

  return (
    <div
      className={`radio-group-custom ${customClass}`}
      style={{
        display: 'flex',
        flexDirection,
        alignItems:
          labelPosition === 'left' || labelPosition === 'right'
            ? 'center'
            : undefined,
        gap: 1,
      }}
    >
      {label && (
        <FormLabel
          component="legend"
          style={{ order: labelOrder, margin: 0, minWidth: 74 }}
        >
          {label}
        </FormLabel>
      )}

      <RadioGroup
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        style={{ order: groupOrder }}
        {...rest}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.id}
            control={<Radio size={size} color={color} />}
            label={option.label}
            labelPlacement={labelPlacement}
          />
        ))}
      </RadioGroup>

      {!!errorText && (
        <p style={{ color: 'red', fontSize: '0.8rem', margin: '2px 0 0' }}>
          {errorText}
        </p>
      )}
    </div>
  );
};

export default RadioButton;
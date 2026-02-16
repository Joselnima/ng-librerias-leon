import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  Chip,
  Box
} from "@mui/material";
import { JSX } from "@emotion/react/jsx-runtime";
import { ComboBoxProps } from "./interfaces/combo-box.interface";

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onChange,
  label,
  multiple = false,
  showChips = false,
  errorText,
  size = "medium",
  variant = "outlined",
  ...rest
}: ComboBoxProps) => {

  const handleChange = (event: SelectChangeEvent<string | string[]>) => {
    const newValue = event.target.value;
    if (multiple) {
      onChange?.(
        Array.isArray(newValue)
          ? newValue.map((v) => {
            const opt = options.find((o) => String(o.id) === v);
            return opt ? opt.id : v;
          })
          : []
      );
    } else {
      const opt = options.find((o) => String(o.id) === newValue);
      onChange?.(opt ? opt.id : newValue);
    }
  };

  // Agrupar opciones
  const groupedOptions = options.reduce<Record<string, typeof options>>((acc, option) => {
    const group = option.group ?? "__nogroup__";
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {});

  const normalizedValue = multiple
    ? Array.isArray(value)
      ? value.map(String)
      : []
    : value !== undefined && value !== null
      ? String(value)
      : "";

  return (
    <FormControl size={size} variant={variant} fullWidth error={!!errorText}>
      {label && <InputLabel id="combo-box" shrink>{label}</InputLabel>}
      <Select
        fullWidth
        labelId="combo-box"
        label={variant === 'outlined' ? label : undefined}
        size={size}
        variant={variant}
        value={normalizedValue}
        onChange={handleChange}
        multiple={multiple}
        renderValue={
          multiple
            ? (selected: string | string[]) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selected as string[]).map((val) => {
                  const opt = options.find((o) => String(o.id) === val);
                  return opt ? <Chip key={val} label={opt.value} /> : null;
                })}
              </Box>
            )
            : undefined
        }
        {...rest}
      >
        {Object.entries(groupedOptions).flatMap(([group, items]) => {
          const children: JSX.Element[] = [];

          if (group !== "__nogroup__") {
            children.push(
              <ListSubheader key={`${group}-header`}>{group}</ListSubheader>
            );
          }

          children.push(
            ...items.map((opt) => {
              const optIdStr = String(opt.id);
              const checked = multiple
                ? (normalizedValue as string[]).includes(optIdStr)
                : false;

              return (
                <MenuItem key={opt.id} value={optIdStr} disabled={opt.disabled}>
                  {multiple && <Checkbox checked={checked} />}
                  <ListItemText primary={opt.value} />
                </MenuItem>
              );
            })
          );

          return children;
        })}
      </Select>
      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl >
  );
};

export default ComboBox;
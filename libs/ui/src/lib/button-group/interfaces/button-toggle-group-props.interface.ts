import { PaletteColor } from "@leon-librerias/core";
import { ButtonGroupProps } from "@mui/material";
import { ButtonToggleGroupOption } from "./button-toggle-group-option.interface";

export interface ButtonToggleGroupProps extends Omit<ButtonGroupProps, 'onChange'> {
    options: ButtonToggleGroupOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    color?: PaletteColor;
}
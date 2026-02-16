import { RadioGroupProps } from "@mui/material";

export interface RadioButtonProps
    extends Omit<RadioGroupProps, 'onChange' | 'value'> {
    label?: string;
    value?: string | number;
    onChange?: (value: string | number) => void;
    options: { id: string | number; label: string }[];
    errorText?: string;
    customClass?: string;
    labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
    color?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "default";
    size?: 'small' | 'medium';
}
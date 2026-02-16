import { CheckboxProps } from "@mui/material";

export interface CheckProps extends Omit<CheckboxProps, 'onChange' | 'checked'> {
    label: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    errorText?: string;
    customClass?: string;
    labelPlacement?: "start" | "end" | "top" | "bottom";
}
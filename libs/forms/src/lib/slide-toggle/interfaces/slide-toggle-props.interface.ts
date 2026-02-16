import { SwitchProps } from "@mui/material";

export interface SlideToggleProps extends Omit<SwitchProps, 'onChange' | 'checked'> {
    label: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    errorText?: string;
    customClass?: string;
    labelPlacement?: "start" | "end" | "top" | "bottom"
}
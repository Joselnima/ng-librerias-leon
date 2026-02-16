import { SelectProps } from "@mui/material";
import type { Options } from "./combo-box-options.interface";

export interface ComboBoxProps extends Omit<SelectProps<string | string[]>, "onChange" | "value" | "multiple"> {
    options: Options[];
    value?: string | number | (string | number)[];
    onChange?: (value: string | number | (string | number)[]) => void;
    label?: string;
    multiple?: boolean;
    errorText?: string;
    showChips?: boolean
}
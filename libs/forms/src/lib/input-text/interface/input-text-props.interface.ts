import { TextFieldProps } from "@mui/material";

export interface InputTextProps
    extends Omit<TextFieldProps, "type" | "onChange" | "value" | "onInput"> {
    type?: "text" | "password" | "email" | "search" | "tel" | "url";
    value?: any;
    errorText?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    onChange?: (value: any) => void;
    onInput?: (value: any, debounceMs: number) => void;
    onEnterKeyDown?: (event: React.KeyboardEvent<any>) => void;
    onBlurChange?: (event: React.FocusEvent<any>) => void;
}
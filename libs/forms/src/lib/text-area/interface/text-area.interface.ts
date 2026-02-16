import { TextFieldProps } from "@mui/material";

export interface TextAreaProps
    extends Omit<TextFieldProps, "onChange" | "value"> {
    value?: string;
    defaultValue?: string;
    errorText?: string;
    minRows?: number;
    onChange?: (value: string) => void;
}
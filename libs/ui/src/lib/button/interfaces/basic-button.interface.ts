import { ButtonProps } from "@mui/material";
import { Base } from "./base.interface";

export interface BasicButtonProps
    extends Omit<Base, 'onClick'>,
    Omit<ButtonProps, 'onClick' | 'loading' | 'content'> {
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
import { ButtonProps } from "@mui/material";
import { Base } from "./base.interface";

export interface BasicButtonProps
    extends Omit<Base, 'onClick'>,
    Omit<ButtonProps, 'onClick' | 'loading'> {
    iconPosition?: 'start' | 'center' | 'end';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
import { IconButtonProps } from '@mui/material/IconButton'
import { Base } from "./base.interface";

export interface ButtonIconProps
    extends Omit<Base, 'onClick'>,
    Omit<IconButtonProps, 'onClick' | 'loading' | 'content'> {
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
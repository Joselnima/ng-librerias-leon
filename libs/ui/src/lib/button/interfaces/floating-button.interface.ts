import { FabProps } from "@mui/material";
import { Base } from "./base.interface";

export interface FloatingButtonProps
    extends Omit<Base, 'onClick'>,
    Omit<FabProps, 'onChange' | 'onClick'> {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
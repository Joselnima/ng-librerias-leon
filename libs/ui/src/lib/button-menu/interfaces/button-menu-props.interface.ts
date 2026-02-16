import { ButtonProps } from "@mui/material/Button";
import { ButtonMenuItem } from "./button-menu-item.interface";

export interface ButtonMenuProps extends Omit<ButtonProps, "onChange"> {
    icon?: React.ReactNode;
    iconPosition?: "start" | "center" | "end";
    items: ButtonMenuItem[];
    buttonText?: string;
    onClose?: () => void;
    menuPosition?: "left" | "right" | "center";
    shape?: "rounded" | "circular" | "pill";
}
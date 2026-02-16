import { useState, MouseEvent } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button, Box } from "@mui/material";
import { ButtonMenuProps } from "./interfaces/button-menu-props.interface";

export const ButtonMenu: React.FC<ButtonMenuProps> = ({
  size = "medium",
  icon,
  iconPosition = "start",
  variant = "outlined",
  color = "primary",
  items,
  disabled = false,
  buttonText = "",
  onClose = () => { },
  menuPosition = "left",
  shape = "rounded", // default
  ...rest
}: ButtonMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onClose();
  };

  const anchorOrigin = {
    vertical: "bottom" as const,
    horizontal:
      menuPosition === "left"
        ? ("left" as const)
        : menuPosition === "right"
          ? ("right" as const)
          : ("center" as const),
  };

  const transformOrigin = {
    vertical: "top" as const,
    horizontal:
      menuPosition === "left"
        ? ("left" as const)
        : menuPosition === "right"
          ? ("right" as const)
          : ("center" as const),
  };

  // Tamaños del botón circular
  const circularSizes: Record<typeof size, number> = {
    small: 32,
    medium: 40,
    large: 48,
  };

  // Tamaños del icono en modo circular
  const circularIconSizes: Record<typeof size, number> = {
    small: 16,
    medium: 18,
    large: 20,
  };

  // Tamaños del icono en modo normal (rounded / pill)
  const normalIconSizes: Record<typeof size, number> = {
    small: 18,
    medium: 20,
    large: 22,
  };

  // Función para renderizar iconos uniformes
  const renderIcon = (fontSize: number) => (
    <Box
      sx={{
        fontSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 1,
      }}
    >
      {icon}
    </Box>
  );

  return (
    <div>
      <Button
        size={size}
        variant={variant}
        color={color}
        disabled={disabled}
        onClick={handleClick}
        aria-controls="simple-menu"
        aria-haspopup="true"
        sx={{
          borderRadius:
            shape === "circular"
              ? "50%"
              : shape === "pill"
                ? 9999
                : 2,
          minWidth: shape === "circular" ? circularSizes[size] : undefined,
          width: shape === "circular" ? circularSizes[size] : undefined,
          height: shape === "circular" ? circularSizes[size] : undefined,
          padding: shape === "circular" ? 0 : undefined,
        }}
        {...rest}
        startIcon={
          shape !== "circular" && iconPosition === "start"
            ? renderIcon(normalIconSizes[size])
            : undefined
        }
        endIcon={
          shape !== "circular" && iconPosition === "end"
            ? renderIcon(normalIconSizes[size])
            : undefined
        }
      >
        {/* Circular → solo ícono reducido */}
        {shape === "circular"
          ? renderIcon(circularIconSizes[size])
          : iconPosition === "center"
            ? renderIcon(normalIconSizes[size])
            : buttonText}
      </Button>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.content}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default ButtonMenu;
import { Button, ButtonGroup } from "@mui/material";
import { ButtonToggleGroupProps } from "./interfaces/button-toggle-group-props.interface";

export const ButtonToggleGroup: React.FC<ButtonToggleGroupProps> = ({
  options,
  value,
  onChange,
  size = 'medium',
  color = 'primary',
  variant = 'outlined',
  ...rest
}: ButtonToggleGroupProps) => {
  return (
    <ButtonGroup
      size={size}
      color={color}
      variant={variant}
      {...rest}
    >
      {options.map((opt: any) => (
        <Button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          variant={variant}
        >
          {opt.content}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default ButtonToggleGroup;

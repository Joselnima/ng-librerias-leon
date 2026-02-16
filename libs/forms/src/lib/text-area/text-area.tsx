import { TextField } from "@mui/material";
import type { TextAreaProps } from "./interface/text-area.interface";

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  defaultValue,
  errorText,
  onChange,
  minRows = 3,
  size = "medium",
  ...props
}) => {
  return (
    <TextField
      {...props}
      multiline
      minRows={minRows}
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => onChange?.(e.target.value)}
      error={!!errorText}
      helperText={errorText}
      size={size}
      fullWidth
      slotProps={
        {
          input: {
            minRows,
            style: { width: "100%", padding: "8px", boxSizing: "border-box" }
          },
          inputLabel: {
            shrink: true
          }
        }
      }
      sx={{
        "& .MuiInputBase-input": {
          resize: "vertical",
        },
      }}
    />
  );
};

export default TextArea;
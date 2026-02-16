import React, { useEffect, useRef, useState } from "react";

// MUI's component:
import { TextField, IconButton, InputAdornment } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// interface:
import { InputTextProps } from "./interface/input-text-props.interface";

export const InputText: React.FC<InputTextProps> = ({
    value,
    onChange,
    onInput,
    errorText,
    type = 'text',
    size = 'medium',
    startAdornment,
    endAdornment,
    onEnterKeyDown,
    onBlurChange,
    ...rest
}) => {
    const [internalValue, setInternalValue] = useState(value ?? null);
    const [showPassword, setShowPassword] = useState(false);
    const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        setInternalValue(value ?? "");
    }, [value]);

    const handleDebouncedInput = (val: string, debounceMs: number) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            onInput?.(val, debounceMs);
        }, debounceMs);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInternalValue(val);
        onChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<any>) => {
        if (e.key === "Enter") {
            onEnterKeyDown?.(e);
        }
    };

    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
        <TextField
            fullWidth
            {...rest}
            value={internalValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={onBlurChange}
            size={size}
            type={inputType}
            onInput={(e) =>
                handleDebouncedInput(
                    (e.target as HTMLInputElement).value,
                    rest.inputProps?.debounceMs ?? 1000
                )
            }
            error={!!errorText}
            helperText={errorText}
            slotProps={{
                input: {
                    startAdornment,
                    endAdornment: (
                        <>
                            {endAdornment}
                            {isPasswordType && (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        size={size === "small" ? "small" : "medium"}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )}
                        </>
                    ),
                },
                inputLabel: {
                    shrink: true,
                }
            }}
        />
    );
};

export default InputText;

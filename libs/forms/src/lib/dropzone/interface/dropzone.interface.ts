import { Accept } from 'react-dropzone';

export interface DropzoneProps {
    name: string;
    control?: (name: string) => any; // Para RHF: puedes pasar {...register(name)} desde fuera
    label?: string;
    errorText?: string;
    accept?: Accept | string | string[];
    multiple?: boolean;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    value?: File | File[] | null;
    onChange?: (files: File | File[] | null) => void;
}
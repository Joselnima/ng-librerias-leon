export interface EditorProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    errorText?: string; // mensaje de error si existe
}
export interface ComboBoxOptions<T = any> {
    id: string | number;
    value: string;
    payload?: T;
    disabled?: boolean;
    group?: string;
}
export interface Base {
    label?: string;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onClick: () => void;
}
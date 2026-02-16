export interface Base {
    content?: string | React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    onClick: () => void;
}
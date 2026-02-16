export interface ModalProps {
    open: boolean
    onClose: () => void
    isFullscreen?: boolean
    draggable?: boolean
    showFullscreenButton?: boolean
    title?: string
    headerTemplate?: React.ReactNode
    content: React.ReactNode
    footerContent?: React.ReactNode
    width?:
    | "auto"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | false
    | { min?: string | number; max?: string | number }
    | string
    | number
    height?: "auto" | { min?: string | number; max?: string | number } | string | number
    children?: React.ReactNode
    disableEscapeKeyDown?: boolean
    disableBackdropClick?: boolean
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false
    fullWidth?: boolean
    className?: string
    onFullscreenToggle?: (isFullscreen: boolean) => void
}
import { MenuSection } from "@leon-librerias/core";

export interface SidebarProps {
    isCollapsed: boolean;
    isOpen: boolean;
    isDesktop: boolean;
    menus: Array<MenuSection>;
    loading: boolean;

    // componentes del sidebar:
    footerContent?: React.ReactNode;
    headerContent?: React.ReactNode;

    // Eventos:
    toggleOpen: () => void;
    toggleCollapse: () => void;

    // Styling:
    backgroundColor?: string;
    textColor?: string;
    activeColor?: string;
    activeTextColor?: string;
    hoverColor?: string;
    borderColor?: string;

    // Mapping icons:
    iconMap?: Record<string, React.ComponentType<{ className?: string }>>;

    // MUI Palette integration (uses primary by default)
    color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | string;
}

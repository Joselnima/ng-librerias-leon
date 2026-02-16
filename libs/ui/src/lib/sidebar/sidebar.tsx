import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

// Interfaces
import { SidebarProps } from "./interface/sidebar.interface";
import { MenuItem } from "@leon-librerias/core";

// Features
import { SidebarOverlay } from "./features/SidebarOverlay";
import { SidebarSearch } from "./features/SidebarSearch";
import { SidebarMenu } from "./features/SidebarMenu";

// Styles
import "./sidebar.css";

// Helper for classes
const cn = (...args: (string | boolean | undefined)[]) => args.filter(Boolean).join(" ");

export function Sidebar({
    isCollapsed,
    isOpen,
    isDesktop,
    menus,
    loading,

    // componentes del sidebar:
    footerContent,
    headerContent,

    // Eventos:
    toggleOpen,
    toggleCollapse,

    // Styling:
    backgroundColor,
    textColor,
    activeColor,
    activeTextColor,
    hoverColor,
    borderColor,
    iconMap = {},
    color = "primary"
}: SidebarProps) {

    const theme = useTheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const handleToggleSubmenu = (name: string) => {
        setOpenSubmenu((prev) => (prev === name ? null : name));
    };

    const handleClickItem = (item: MenuItem) => {
        if (item.children && item.children.length > 0) {
            handleToggleSubmenu(item.label);
        } else if (item.path) {
            navigate(item.path);
        }
    };

    // Computamos los colores dinámicamente basándonos en props o en el tema de MUI
    const sidebarStyles = useMemo(() => {
        const muiPalette = (theme.palette as any)[color] || theme.palette.primary;

        return {
            '--sidebar-bg': backgroundColor || theme.palette.background.paper,
            '--sidebar-text': textColor || theme.palette.text.primary,
            '--sidebar-active-bg': activeColor || muiPalette.main,
            '--sidebar-active-text': activeTextColor || muiPalette.contrastText,
            '--sidebar-hover-bg': hoverColor || (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'),
            '--sidebar-border': borderColor || theme.palette.divider,
            '--sidebar-accent': theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        } as React.CSSProperties;
    }, [theme, color, backgroundColor, textColor, activeColor, activeTextColor, hoverColor, borderColor]);

    return (
        <>
            {/* Overlay móvil */}
            <SidebarOverlay isOpen={isOpen} toggleOpen={toggleOpen} />

            <div
                className={cn(
                    "lion-sidebar",
                    isCollapsed && isDesktop && "lion-sidebar--collapsed",
                    !isDesktop && "lion-sidebar--mobile",
                    isOpen && !isDesktop && "lion-sidebar--open"
                )}
                style={sidebarStyles}
            >
                {/* Header / Logo */}
                <div className="lion-sidebar__header">
                    {headerContent}
                </div>

                {/* Search */}
                <SidebarSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isCollapsed={isCollapsed}
                    isDesktop={isDesktop}
                />

                {/* Menú */}
                <SidebarMenu
                    menus={menus}
                    loading={loading}
                    isCollapsed={isCollapsed}
                    isDesktop={isDesktop}
                    pathname={pathname}
                    openSubmenu={openSubmenu}
                    iconMap={iconMap}
                    onItemClick={handleClickItem}
                    onNavigate={navigate}
                    cn={cn}
                />

                {/* Footer - Perfil */}
                <div className="lion-sidebar__footer">
                    {footerContent}
                </div>
            </div>
        </>
    );
}


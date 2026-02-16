import React from "react";
import { MenuSection, MenuItem } from "@leon-librerias/core";
import { CircularProgress } from '@mui/material';
import Scrollbar from "../../scrollbar/Scrollbar";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface SidebarMenuProps {
    menus: MenuSection[];
    loading: boolean;
    isCollapsed: boolean;
    isDesktop: boolean;
    pathname: string;
    openSubmenu: string | null;
    iconMap: Record<string, React.ComponentType>;
    onItemClick: (item: MenuItem) => void;
    onNavigate: (path: string) => void;
    cn: (...args: (string | boolean | undefined)[]) => string;
}

export const SidebarMenu = ({
    menus,
    loading,
    isCollapsed,
    isDesktop,
    pathname,
    openSubmenu,
    iconMap,
    onItemClick,
    onNavigate,
    cn
}: SidebarMenuProps) => {
    return (
        <Scrollbar
            enabled
            scrollbarOptions={{ wheelPropagation: false, suppressScrollX: true }}
            className="lion-sidebar__content"
        >
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <CircularProgress color="inherit" />
                </div>
            ) : (
                menus.map((section, idx) => (
                    <div key={idx} className="lion-sidebar__section">
                        {section.title && (!isCollapsed || !isDesktop) && (
                            <h3 className="lion-sidebar__section-title">
                                {section.title}
                            </h3>
                        )}

                        <div className="lion-sidebar__list">
                            {section?.items?.map((item: MenuItem) => (
                                <SidebarMenuItem
                                    key={item.label}
                                    item={item}
                                    isActive={
                                        (item.path && pathname === item.path) ||
                                        item.children?.some((child: any) => child.path && pathname === child.path) || false
                                    }
                                    isSubmenuOpen={openSubmenu === item.label}
                                    isCollapsed={isCollapsed}
                                    isDesktop={isDesktop}
                                    pathname={pathname}
                                    iconMap={iconMap}
                                    onItemClick={onItemClick}
                                    onNavigate={onNavigate}
                                    cn={cn}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </Scrollbar>
    );
};

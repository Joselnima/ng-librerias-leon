import React from "react";
import { MenuItem } from "@leon-librerias/core";
import { Group, ExpandLess, ExpandMore } from '@mui/icons-material';

interface SidebarMenuItemProps {
    item: MenuItem;
    isActive: boolean;
    isSubmenuOpen: boolean;
    isCollapsed: boolean;
    isDesktop: boolean;
    pathname: string;
    iconMap: Record<string, React.ComponentType>;
    onItemClick: (item: MenuItem) => void;
    onNavigate: (path: string) => void;
    cn: (...args: (string | boolean | undefined)[]) => string;
}

export const SidebarMenuItem = ({
    item,
    isActive,
    isSubmenuOpen,
    isCollapsed,
    isDesktop,
    pathname,
    iconMap,
    onItemClick,
    onNavigate,
    cn
}: SidebarMenuItemProps) => {
    const Icon = iconMap[item.icon as string] || Group;
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div key={item.label}>
            <div
                role="button"
                tabIndex={0}
                onClick={() => onItemClick(item)}
                onKeyDown={(e) => e.key === "Enter" && onItemClick(item)}
                className={cn(
                    "lion-sidebar__item",
                    isActive && !hasChildren && "lion-sidebar__item--active"
                )}
            >
                <div className="lion-sidebar__item-icon">
                    <Icon />
                </div>

                <span className="lion-sidebar__item-text">
                    {item.label}
                </span>

                {hasChildren && (
                    <div className="lion-sidebar__item-arrow">
                        {isSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </div>
                )}
            </div>

            {/* Submenús */}
            {hasChildren && (
                <div
                    className="lion-sidebar__submenu"
                    style={{
                        maxHeight: isSubmenuOpen ? '500px' : '0',
                        opacity: isSubmenuOpen ? 1 : 0
                    }}
                >
                    {item.children?.map((child: MenuItem) => {
                        const ChildIcon = iconMap[child.icon as string] || Group;
                        const isChildActive = child.path && pathname === child.path;

                        return (
                            <div
                                key={child.label}
                                role="button"
                                tabIndex={0}
                                onClick={() => child.path && onNavigate(child.path)}
                                onKeyDown={(e) => e.key === "Enter" && child.path && onNavigate(child.path)}
                                className={cn(
                                    "lion-sidebar__item",
                                    isChildActive && "lion-sidebar__item--active"
                                )}
                            >
                                <div className="lion-sidebar__item-icon">
                                    <ChildIcon />
                                </div>
                                <span className="lion-sidebar__item-text">
                                    {child.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

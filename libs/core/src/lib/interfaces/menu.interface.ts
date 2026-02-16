type MenuItemType = 'link' | 'collapsible';

export interface MenuItem {
    type: MenuItemType;
    label: string;
    icon?: string;
    path?: string;
    children?: MenuItem[];
}

export interface MenuSection {
    title?: string;
    items?: MenuItem[];
}
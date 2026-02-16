import { Search } from '@mui/icons-material';


interface SidebarSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isCollapsed: boolean;
    isDesktop: boolean;
}

export const SidebarSearch = ({
    searchQuery,
    setSearchQuery,
    isCollapsed,
    isDesktop
}: SidebarSearchProps) => {
    if (isCollapsed && isDesktop) return null;

    return (
        <div className="lion-sidebar__search">
            <div className="lion-sidebar__search-container">
                <Search className="lion-sidebar__search-icon" />
                <input
                    placeholder="Quick Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery((e.target as HTMLInputElement).value ?? "")}
                    className="lion-sidebar__search-input"
                />
            </div>
        </div>
    );
};



interface SidebarOverlayProps {
    isOpen: boolean;
    toggleOpen: () => void;
}

export const SidebarOverlay = ({ isOpen, toggleOpen }: SidebarOverlayProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="lion-sidebar__overlay lg:hidden"
            onClick={toggleOpen}
        />
    );
};

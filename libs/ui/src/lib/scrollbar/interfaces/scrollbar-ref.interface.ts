import { ScrollbarGeometry } from "./scrollbar-geometry.interface";
import { ScrollbarPosition } from "./scrollbar-position.interface";

export interface ScrollbarRef {
    update: () => void;
    destroy: () => void;
    isEnabled: () => boolean;
    geometry: () => ScrollbarGeometry;
    position: (absolute?: boolean) => ScrollbarPosition;
    scrollTo: (x: number, y?: number, speed?: number) => void;
    scrollToX: (x: number, speed?: number) => void;
    scrollToY: (y: number, speed?: number) => void;
    scrollToTop: (offset?: number, speed?: number) => void;
    scrollToBottom: (offset?: number, speed?: number) => void;
    scrollToLeft: (offset?: number, speed?: number) => void;
    scrollToRight: (offset?: number, speed?: number) => void;
    scrollToElement: (
        selector: string,
        offset?: number,
        ignoreVisible?: boolean,
        speed?: number
    ) => void;
}
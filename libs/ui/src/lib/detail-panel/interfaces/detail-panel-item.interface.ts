// 🔹 Properties common to both cases 
interface DetailPanelCommon {
    content: React.ReactNode;
    headerColor?: string;
    disabled?: boolean;
}

// 🔹 Case 1: label + icon
interface DetailPanelWithLabel extends DetailPanelCommon {
    label: string;
    icon?: React.ReactNode;
    headerTemplate?: never;
}

// 🔹 Case 2: headerTemplate
interface DetailPanelWithTemplate extends DetailPanelCommon {
    headerTemplate: React.ReactNode;
    label?: never;
    icon?: never;
}

// 🔥 Correct final union
export type DetailPanelItem = DetailPanelWithLabel | DetailPanelWithTemplate;

export interface DetailPanelProps {
    items: DetailPanelItem[];
    defaultExpandedIndex?: number;
}
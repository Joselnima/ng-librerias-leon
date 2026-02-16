import { TabItem } from './tab-view-item.interface';

export interface TabViewProps {
    tabs: TabItem[];  // Array de pestañas
    defaultIndex?: number;  // Índice de la pestaña seleccionada por defecto
    onChange?: (newIndex: number) => void;  // Callback para cambiar la pestaña
}
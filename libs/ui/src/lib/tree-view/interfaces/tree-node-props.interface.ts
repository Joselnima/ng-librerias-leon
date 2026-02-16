import { TreeViewNode } from "./tree-view-node.interface"

export interface ExpandedState {
    [key: string | number]: boolean
}

export interface SelectedState {
    [key: string | number]: boolean
}

export interface LoadingState {
    [key: string | number]: boolean
}

export interface TreeViewProps {
    items: TreeViewNode[]
    multiple?: boolean
    height?: number | string
    selectedIds?: (string | number)[]
    onNodeClick?: (node: TreeViewNode) => void
    onNodeSelect?: (ids: string | number | (string | number)[]) => void
    onNodeExpand?: (id: string | number) => void
    loadChildren?: (id: string | number) => Promise<TreeViewNode[]>
    onError?: (error: Error) => void
}

export interface TreeNodeProps {
    node: TreeViewNode
    level: number
    multiple?: boolean
    expanded: ExpandedState
    selected: SelectedState
    loading: LoadingState
    onNodeClick?: (node: TreeViewNode) => void
    onNodeSelect?: (ids: string | number | (string | number)[]) => void
    onNodeExpand?: (id: string | number) => void
    onToggleExpand?: (id: string | number) => void
    onToggleSelect?: (id: string | number, isMultiple: boolean) => void
    onLoadChildren?: (id: string | number) => Promise<void>
}

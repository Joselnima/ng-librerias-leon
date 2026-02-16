export interface TreeViewNode {
    id: string | number
    label: string
    icon?: React.ReactNode
    children?: TreeViewNode[]
    disabled?: boolean
    isLoadable?: boolean
}
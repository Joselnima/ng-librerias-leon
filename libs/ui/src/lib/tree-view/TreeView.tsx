import type React from "react"
import { useState, useCallback, useMemo, useEffect, startTransition } from "react"
import { Box, Alert, useTheme } from "@mui/material"
import { TreeNode } from "./features/tree-node"
import { ExpandedState, LoadingState, SelectedState, TreeViewProps } from "./interfaces/tree-node-props.interface"
import { TreeViewNode } from "./interfaces/tree-view-node.interface"

export const TreeView: React.FC<TreeViewProps> = ({
    items,
    multiple = false,
    height = "auto",
    selectedIds: controlledSelectedIds,
    onNodeClick,
    onNodeSelect,
    onNodeExpand,
    loadChildren,
    onError,
}) => {
    const theme = useTheme()
    const [expanded, setExpanded] = useState<ExpandedState>({})
    const [selected, setSelected] = useState<SelectedState>({})
    const [loading, setLoading] = useState<LoadingState>({})
    const [error, setError] = useState<Error | null>(null)
    const [itemsState, setItemsState] = useState<TreeViewNode[]>(items)

    useEffect(() => {
        if (controlledSelectedIds !== undefined) {
            const newSelected: SelectedState = {}
            controlledSelectedIds.forEach((id: string | number) => {
                newSelected[id] = true
            })
            setSelected(newSelected)
        }
    }, [controlledSelectedIds])

    const updateChildrenInTree = useCallback(
        (nodes: TreeViewNode[], nodeId: string | number, children: TreeViewNode[]): TreeViewNode[] => {
            return nodes.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, children }
                }
                if (node.children && node.children.length > 0) {
                    return {
                        ...node,
                        children: updateChildrenInTree(node.children, nodeId, children),
                    }
                }
                return node
            })
        },
        [],
    )

    const findNodeInTree = useCallback((nodes: TreeViewNode[], nodeId: string | number): TreeViewNode | null => {
        for (const node of nodes) {
            if (String(node.id) === String(nodeId)) {
                return node
            }
            if (node.children && node.children.length > 0) {
                const found = findNodeInTree(node.children, nodeId)
                if (found) return found
            }
        }
        return null
    }, [])

    const getAllDescendantIds = useCallback((node: TreeViewNode): (string | number)[] => {
        const ids: (string | number)[] = [node.id]
        if (node.children && node.children.length > 0) {
            node.children.forEach((child: TreeViewNode) => {
                ids.push(...getAllDescendantIds(child))
            })
        }
        return ids
    }, [])

    const handleToggleExpand = useCallback((nodeId: string | number) => {
        setExpanded((prev: ExpandedState) => ({
            ...prev,
            [nodeId]: !prev[nodeId],
        }))
    }, [])

    const handleLoadChildren = useCallback(
        async (nodeId: string | number) => {
            if (!loadChildren) return

            try {
                setLoading((prev: LoadingState) => ({ ...prev, [nodeId]: true }))
                const children = await loadChildren(nodeId)
                setItemsState((prev) => updateChildrenInTree(prev, nodeId, children))
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Unknown error")
                setError(error)
                if (onError) {
                    onError(error)
                }
            } finally {
                setLoading((prev: LoadingState) => ({ ...prev, [nodeId]: false }))
            }
        },
        [loadChildren, updateChildrenInTree, onError],
    )

    const handleToggleSelect = useCallback(
        (nodeId: string | number, isMultiple: boolean) => {
            setSelected((prev: SelectedState) => {
                let newSelected: SelectedState

                if (!isMultiple) {
                    // Single selection - deselect others
                    newSelected = prev[nodeId] ? {} : { [nodeId]: true }
                } else {
                    // Multiple selection with cascading
                    const isCurrentlySelected = prev[nodeId]
                    const node = findNodeInTree(itemsState, nodeId)

                    if (!node) {
                        newSelected = { ...prev, [nodeId]: !prev[nodeId] }
                    } else {
                        // Get all descendant IDs
                        const descendantIds = getAllDescendantIds(node)
                        newSelected = { ...prev }

                        if (isCurrentlySelected) {
                            descendantIds.forEach((id) => {
                                newSelected[id] = false
                            })
                        } else {
                            descendantIds.forEach((id) => {
                                newSelected[id] = true
                            })
                        }
                    }
                }

                if (onNodeSelect) {
                    startTransition(() => {
                        const selectedIds = Object.keys(newSelected)
                            .filter((id) => newSelected[id])
                            .map((id) => {
                                const originalNode = findNodeInTree(itemsState, id)
                                return originalNode?.id ?? id
                            })

                        onNodeSelect(selectedIds.length === 1 ? selectedIds[0] : selectedIds)
                    })
                }

                return newSelected
            })
        },
        [onNodeSelect, itemsState, findNodeInTree, getAllDescendantIds],
    )

    const selectedCount = useMemo(() => Object.values(selected).filter(Boolean).length, [selected])

    return (
        <Box
            sx={{
                height,
                overflow: "auto",
                border: "1px solid",
                borderColor: theme.palette.divider,
                borderRadius: 1,
                p: 1,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
            )}

            {itemsState.length === 0 ? (
                <Box sx={{ py: 4, textAlign: "center", color: theme.palette.text.secondary }}>No items available</Box>
            ) : (
                <Box>
                    {itemsState.map((node) => (
                        <TreeNode
                            key={`${String(node.id)}`}
                            node={node}
                            level={0}
                            multiple={multiple}
                            expanded={expanded}
                            selected={selected}
                            loading={loading}
                            onNodeClick={onNodeClick}
                            onNodeSelect={onNodeSelect}
                            onNodeExpand={onNodeExpand}
                            onToggleExpand={handleToggleExpand}
                            onToggleSelect={handleToggleSelect}
                            onLoadChildren={handleLoadChildren}
                        />
                    ))}
                </Box>
            )}

            {multiple && selectedCount > 0 && (
                <Box
                    sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: theme.palette.divider,
                        fontSize: "0.875rem",
                        color: theme.palette.text.secondary,
                    }}
                >
                    {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
                </Box>
            )}
        </Box>
    )
}
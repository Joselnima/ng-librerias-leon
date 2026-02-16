import type React from "react"
import { Box, Checkbox, CircularProgress, IconButton, Collapse, Stack, Typography, useTheme } from "@mui/material"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeNodeProps } from "../interfaces/tree-node-props.interface";

export const TreeNode: React.FC<TreeNodeProps> = ({
    node,
    level,
    multiple = false,
    expanded,
    selected,
    loading,
    onNodeClick,
    onNodeSelect,
    onNodeExpand,
    onToggleExpand,
    onToggleSelect,
    onLoadChildren,
}) => {
    const theme = useTheme()
    const isExpanded = expanded[node.id]
    const isSelected = selected[node.id] ?? false
    const isLoading = loading[node.id]
    const nodeId = String(node.id)

    const hasChildren = (node.children && node.children.length > 0) || node.isLoadable

    const handleExpandClick = async (e: React.MouseEvent) => {
        e.stopPropagation()

        // If already expanded, just collapse it
        if (isExpanded) {
            if (onToggleExpand) {
                onToggleExpand(node.id)
            }
            return
        }

        // First load children if needed before expanding
        if (!isExpanded && node.children && node.children.length === 0 && onLoadChildren) {
            if (onToggleExpand) {
                onToggleExpand(node.id)
            }
            try {
                await onLoadChildren(node.id)
            } catch (error) {
                console.error(`Error loading children for node ${node.id}:`, error)
            }
        } else {
            // Just expand (no lazy loading needed)
            if (onToggleExpand) {
                onToggleExpand(node.id)
            }
        }

        if (onNodeExpand) {
            onNodeExpand(node.id)
        }
    }

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (node.disabled) return

        // If has children, expand instead of select
        if (hasChildren) {
            handleExpandClick(e)
            return
        }

        // No children: just select
        if (multiple && onToggleSelect) {
            onToggleSelect(node.id, true)
        } else if (!multiple && onToggleSelect) {
            onToggleSelect(node.id, false)
        }

        if (onNodeClick) {
            onNodeClick(node)
        }
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()

        if (node.disabled) return

        if (onToggleSelect) {
            onToggleSelect(node.id, true)
        }
    }

    return (
        <Box key={nodeId}>
            {/* Node Content */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                    pl: `${level * 24}px`,
                    py: 0.5,
                    pr: 1,
                    cursor: node.disabled ? "not-allowed" : "pointer",
                    opacity: node.disabled ? 0.6 : 1,
                    backgroundColor: isSelected ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                        backgroundColor: node.disabled ? "transparent" : theme.palette.action.hover,
                    },
                    borderRadius: 1,
                    transition: "background-color 0.2s ease",
                }}
                onClick={handleNodeClick}
            >
                {/* Expand Button */}
                {hasChildren ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 24,
                            height: 24,
                            minWidth: 24,
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={16} />
                        ) : (
                            <IconButton
                                size="small"
                                onClick={handleExpandClick}
                                disabled={node.disabled}
                                sx={{
                                    padding: 0,
                                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                                    transition: "transform 0.2s ease",
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                <ChevronRightIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                ) : (
                    <Box sx={{ width: 24, minWidth: 24 }} />
                )}

                {/* Checkbox */}
                {multiple && (
                    <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                        disabled={node.disabled}
                        onClick={(e) => e.stopPropagation()}
                        inputProps={{ "aria-label": `Select ${node.label}` }}
                    />
                )}

                {/* Icon */}
                {node.icon && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: 24,
                        }}
                    >
                        {node.icon}
                    </Box>
                )}

                {/* Label */}
                <Typography
                    sx={{
                        flex: 1,
                        userSelect: "none",
                        fontWeight: isSelected ? 600 : 400,
                        color: theme.palette.text.primary,
                    }}
                >
                    {node.label}
                </Typography>
            </Stack>

            {/* Children */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit={false}>
                <Box>
                    {node.children && node.children.length > 0 && (
                        <>
                            {node.children.map((child) => (
                                <TreeNode
                                    key={`${String(child.id)}`}
                                    node={child}
                                    level={level + 1}
                                    multiple={multiple}
                                    expanded={expanded}
                                    selected={selected}
                                    loading={loading}
                                    onNodeClick={onNodeClick}
                                    onNodeSelect={onNodeSelect}
                                    onNodeExpand={onNodeExpand}
                                    onToggleExpand={onToggleExpand}
                                    onToggleSelect={onToggleSelect}
                                    onLoadChildren={onLoadChildren}
                                />
                            ))}
                        </>
                    )}
                </Box>
            </Collapse>
        </Box>
    )
}
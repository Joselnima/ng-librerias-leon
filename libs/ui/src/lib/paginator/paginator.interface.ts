"use client";

import { PaginationProps } from "@mui/material";

export interface PaginatorProps extends PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    renderItem?: (item: any) => React.ReactNode;
}
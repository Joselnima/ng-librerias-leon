import React from 'react';

// MUI components
import { Pagination } from '@mui/material';

// interfaces
import { PaginatorProps } from './paginator.interface';

export const Paginator: React.FC<PaginatorProps> = ({
    page,
    totalPages,
    onPageChange,
    color = 'primary',
    variant = 'outlined',
    shape = 'rounded',
    size = 'medium',
    showFirstButton = true,
    showLastButton = true,
    renderItem,
}) => {
    
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        onPageChange(value);
    };

    return (
        <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color={color}
            variant={variant}
            shape={shape}
            size={size}
            showFirstButton={showFirstButton}
            showLastButton={showLastButton}
            renderItem={renderItem ? (item) => renderItem(item) : undefined}
        />
    );
};

export default Paginator;
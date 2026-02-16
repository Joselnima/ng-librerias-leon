import { useState } from 'react';

// CORE:
import { DetailPanelProps } from './interfaces/detail-panel-item.interface'

// MUI
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const DetailPanel: React.FC<DetailPanelProps> = ({
    items,
    defaultExpandedIndex = -1
}) => {

    const [expandedIndex, setExpandedIndex] = useState<number>(defaultExpandedIndex);

    const handleChange = (index: number) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedIndex(isExpanded ? index : -1);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {items.map((item, index) => (
                <Accordion
                    key={index}
                    expanded={expandedIndex === index}
                    onChange={handleChange(index)}
                    sx={{ marginBottom: 2 }}
                    disabled={item.disabled}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}-content`}
                        id={`panel${index}-header`}
                        sx={{
                            backgroundColor: item.headerColor || 'transparent',
                            opacity: item.disabled ? 0.5 : 1,
                            '&:hover': {
                                backgroundColor: item.headerColor
                                    ? `${item.headerColor}AA`
                                    : 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        {/* ⭐ PRIORITY: headerTemplate > label+icon */}
                        {item.headerTemplate ? (
                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                {item.headerTemplate}
                            </Box>
                        ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {item.icon && (
                                    <Box sx={{ marginRight: 1 }}>
                                        {item.icon}
                                    </Box>
                                )}
                                <Typography>{item.label}</Typography>
                            </Box>
                        )}
                    </AccordionSummary>

                    <AccordionDetails>
                        {item.content}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default DetailPanel;
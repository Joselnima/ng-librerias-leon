import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { TabViewProps } from './interfaces/tab-view.interface';

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  defaultIndex = 0,
  onChange,
}: TabViewProps) => {

  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setSelectedIndex(newIndex);
    onChange && onChange(newIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={selectedIndex}
        onChange={handleTabChange}
        aria-label="navigation tabs"
        variant="fullWidth"
      >
        {tabs.map((tab, index: number) => (
          <Tab
            key={index}
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {tab.icon && <Box sx={{ marginRight: 1 }}>{tab.icon}</Box>}
                {tab.label}
              </Box>
            }
            disabled={tab.disabled}
          />
        ))}
      </Tabs>
      <Box sx={{ padding: 2 }}>{tabs[selectedIndex]?.content}</Box>
    </Box>
  );
};

export default TabView;
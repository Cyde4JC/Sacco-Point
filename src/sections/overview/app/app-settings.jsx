import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AppTellersList } from './app-tellers-list';
import AppBranches from './app-branches';

function AppSettings() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">  
     <CustomBreadcrumbs
                    heading="Main Settings"
                    links={[
                      { name: 'Dashboard', href: paths.dashboard.root },
                      { name: 'Main Settings', href: paths.dashboard.general.settings },
                      { name: 'List' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                  />       
    <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Tellers" />
        <Tab label="Branches" />

      </Tabs>
      <Box>
        {currentTab === 0 && <AppTellersList />}
        {currentTab === 1 && <AppBranches />}
        
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppSettings;

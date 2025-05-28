import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { AppGlList } from './app-gl-list';
import AddGl from './add-gl';

function AppGlAccounts() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">  
     <CustomBreadcrumbs
                    heading="GL Accounts"
                    links={[
                      { name: 'Dashboard', href: paths.dashboard.root },
                      { name: 'GL Accounts', href: paths.dashboard.general.gl },
                      { name: 'List' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                  />       
    <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="GL Accounts" />
        <Tab label="Add a GL Account" />

      </Tabs>
      <Box>
        {currentTab === 0 && <AppGlList />}
        {currentTab === 1 && <AddGl />}
        
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppGlAccounts;

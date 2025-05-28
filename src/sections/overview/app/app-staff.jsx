import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { AppStaffList } from './app-staff-list';
import AddStaff from './add-staff';


function AppStaff() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
              <CustomBreadcrumbs
                heading="Staff"
                links={[
                  { name: 'Dashboard', href: paths.dashboard.root },
                  { name: 'Staff', href: paths.dashboard.general.staff },
                  { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
              />
              <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Staff" />
        <Tab label="Add Staff" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {currentTab === 0 && <AppStaffList />}
        {currentTab === 1 && <AddStaff />}
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppStaff;

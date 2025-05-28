import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import AddMember from './add-member';
import { AppMembersList } from './app-members-list';
import AddMemberBusiness from './add-member-business';

function AppMembers() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Members"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Members', href: paths.dashboard.general.members },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card sx={{ mt: 2, padding: 2 }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={currentTab} onChange={handleChange} centered>
            <Tab label="Registered Members" />
            <Tab label="Individual Application" />
            <Tab label="Corporate Application" />
          </Tabs>
          <Box sx={{ p: 3 }}>
            {currentTab === 0 && <AppMembersList />}
            {currentTab === 1 && <AddMember />}
            {currentTab === 2 && <AddMemberBusiness />}

          </Box>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default AppMembers;

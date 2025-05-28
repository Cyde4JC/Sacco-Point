import React, { useState } from 'react';
import { useParams } from 'src/routes/hooks';
import { Tabs, Tab, Box, Card, CardHeader } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import AppTellerDeposits from './app-teller-deposits';
import AppTellerTransactions from './app-teller-transactions';
import { AppTellerDashboard } from './app-teller-dashboard';
import AppAccountDeposit from './app-account-deposit';

function AppTellerDetails() {
  const [currentTab, setCurrentTab] = useState(0);
  const { account_number = '',
    account_name = '',
  } = useParams();


  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading={`Teller Account: ${account_name}`}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Teller Accounts', href: paths.dashboard.general.teller },
          { name: 'List' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card sx={{ mt: 2, padding: 2 }}>
        <AppTellerDashboard />
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs value={currentTab} onChange={handleChange} centered>
            <Tab label="Cash Deposits" />
            <Tab label="Transactions Statements" />
          </Tabs>
          <Box>
            {currentTab === 0 && <AppTellerDeposits />}
            {currentTab === 1 && <AppTellerTransactions />}
          </Box>
        </Box>
      </Card>
    </DashboardContent>
  );
}

export default AppTellerDetails;

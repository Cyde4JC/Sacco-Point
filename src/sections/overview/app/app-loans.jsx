import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import LoanApplication from './loan-application';
import AppAllLoans from './app-all-loans';
import { AppAllLoansPending } from './app-all-loans-pending';
import { AppAllLoansUndisbursed } from './app-all-loans-undisbursed';

function AppLoans() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
              <CustomBreadcrumbs
                heading="Loans"
                links={[
                  { name: 'Dashboard', href: paths.dashboard.root },
                  { name: 'Loans', href: paths.dashboard.general.loans },
                  { name: 'List' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
              />
              <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Loan Applications" />
        <Tab label="Loan Applications Approvals" />
        <Tab label="Disbursement Approvals" />
        <Tab label="All Loans" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {currentTab === 0 && <LoanApplication />}
        {currentTab === 1 && <AppAllLoansPending />}
        {currentTab === 2 && <AppAllLoansUndisbursed />}
        {currentTab === 3 && <AppAllLoans />}
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppLoans;

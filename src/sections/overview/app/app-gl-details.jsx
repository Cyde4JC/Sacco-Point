import React, { useState } from 'react';
import { useParams } from 'src/routes/hooks';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { paths } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import AppGlDeposit from './app-gl-deposit';
import AppGlTransfer from './app-gl-transfer';
import AppGlTransactions from './app-gl-transactions';
import AppGlTransferPost from './app-gl-transfer-post';

function AppGlDetails() {
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
                    heading={`GL Account: ${account_name}`}
                    links={[
                      { name: 'Dashboard', href: paths.dashboard.root },
                      { name: 'Gl Accounts', href: paths.dashboard.general.gl },
                      { name: 'List' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                  />       
    <Card sx={{ mt: 2, padding: 2 }}>
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Account Funding" />
        <Tab label="Debits" />
        <Tab label="POST" />
        {/* <Tab label="Bill Payments" /> */}
        <Tab label="Transaction Statements" />
      </Tabs>
      <Box>
        {currentTab === 0 && <AppGlDeposit />}
        {currentTab === 1 && <AppGlTransfer />}
        {currentTab === 2 && <AppGlTransferPost />}
        {/* {currentTab === 2 && <AppGlBillpayment />} */}
        {currentTab === 3 && <AppGlTransactions />}
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppGlDetails;

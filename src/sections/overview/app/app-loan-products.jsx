import React, { useState } from 'react';
import { Tabs, Tab, Box, Card } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import AppLoanproductsList from './app-loanproducts-list';
import AddLoanProducts from './add-loan-products';

function AppLoanProducts() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <DashboardContent maxWidth="xl">
              <CustomBreadcrumbs
                heading="Loan Products"
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
        <Tab label="Loan Products" />
        <Tab label="Add Loan Products" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {currentTab === 0 && <AppLoanproductsList />}
        {currentTab === 1 && <AddLoanProducts />}
      
      </Box>
    </Box>
    </Card>
    </DashboardContent>
  );
}

export default AppLoanProducts;

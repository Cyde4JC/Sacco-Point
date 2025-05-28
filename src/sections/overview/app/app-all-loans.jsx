import React, { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppAllLoansPending } from './app-all-loans-pending';
import { AppAllLoansActive } from './app-all-loans-active';
import { AppAllLoansPartially } from './app-all-loans-partially';
import { AppAllLoansPaid } from './app-all-loans-paid';

function AppAllLoans() {
  const [currentTab, setCurrentTab] = useState(0);      

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Tabs value={currentTab} onChange={handleChange} centered>
        <Tab label="Active Loans" /> 
        <Tab label="Partially Paid Loans" />
        <Tab label="Fully Paid Loans" />
      </Tabs>
        {currentTab === 0 && <AppAllLoansActive />}
        {currentTab === 1 && <AppAllLoansPartially />}
        {currentTab === 2 && <AppAllLoansPaid />}   
        </>
  );
}

export default AppAllLoans;

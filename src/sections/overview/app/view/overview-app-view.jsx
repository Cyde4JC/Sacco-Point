import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Skeleton, Stack, Typography } from '@mui/material';
import { CONFIG } from 'src/config-global';
import { fDateTime } from 'src/utils/format-time';
import { DashboardContent } from 'src/layouts/dashboard';
import axios, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { DashWidgetSummary } from '../app-dash-widget-summary';
import { AppMembersList } from '../app-members-list';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState('Yearly');

  const [data, setData] = useState({
    total_loans_counts: 0,
    unpaid_loans_count: 0,
    fully_paid_loans_count: 0,
    partially_paid_loans_count: 0,
    overdue_loans_count: 0,
    unpaid_loans_sum: 0,
    fully_paid_loans_sum: 0,
    fully_paid_loans_principal_sum: 0,
    partially_paid_loans_sum: 0,
    overdue_loans_sum: 0,
    total_loans_amounts_disbursed: 0,
    paid_loans_sum: 0,
    sacco_shares: 0,
    sacco_savings: 0,
    sacco_member: 0,
    sacco_welfares: 0,
    sacco_current: 0,
    sacco_loans: 0,
    graph_data: null,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async (days = 365) => {
    setLoading(true);
    try {
      const response = await axios.get(endpoints.dashboard, { params: { days } });
      setData((prev) => ({
        ...prev,
        ...response?.data?.data,
      }));
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const {
    total_loans_counts,
    unpaid_loans_count,
    fully_paid_loans_count,
    partially_paid_loans_count,
    overdue_loans_count,
    unpaid_loans_sum,
    fully_paid_loans_sum,
    fully_paid_loans_principal_sum,
    partially_paid_loans_sum,
    overdue_loans_sum,
    total_loans_amounts_disbursed,
    paid_loans_sum,
    sacco_shares,
    sacco_savings,
    sacco_member,
    sacco_welfares,
    sacco_current,
    sacco_loans,
  } = data;

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
        Welcome, {user?.role} {user?.display_name} 👋  
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>It’s {fDateTime(time)}</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Total Loans" total={total_loans_counts || 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/analytics.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Unpaid Loans" total={unpaid_loans_count || 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/banking.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Partially Paid Loans" total={partially_paid_loans_count || 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/booking.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Fully Paid Loans" total={fully_paid_loans_count || 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/dashboard.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Overdue Loans" total={overdue_loans_count|| 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/disabled.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Loans Disbursed" total={total_loans_amounts_disbursed|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/invoice.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Paid Loans Total" total={paid_loans_sum|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/in.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Unpaid Loans Amount" total={unpaid_loans_sum|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/out.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Sacco Shares" total={sacco_shares|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/kanban.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Sacco Savings" total={sacco_savings|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/mail.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Sacco Members" total={sacco_member|| 0} icon={`${CONFIG.assetsDir}/assets/icons/navbar/users.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Sacco Current Balance" total={sacco_current|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/wallet.svg`} />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary title="Sacco Loans" total={sacco_loans|| 0} is_currency icon={`${CONFIG.assetsDir}/assets/icons/navbar/transactions.svg`} />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AppMembersList title="Members" />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { Skeleton, Stack, Typography } from '@mui/material';
import { CONFIG } from 'src/config-global';
import { fDateTime } from 'src/utils/format-time';
import { DashboardContent } from 'src/layouts/dashboard';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';
import axios, { endpoints } from 'src/utils/axios';
import { ApiRequests } from '../app-api-requests';
import { DashWidgetSummary } from '../app-dash-widget-summary';
import { TransactionsCount } from '../app-transactions-count';
// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useAuthContext();

  const [data, setData] = useState({
    total_members: 0,
    total_money_in: 0,
    total_money_out: 0,
    total_transactions: 0,
  });

  const { total_members, total_money_in, total_money_out, total_transactions, graph_data } = data;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getDashboard();
  }, []);

  const [loading, setLoading] = useState(false);
  const getDashboard = async (days = 365) => {
    setLoading(true);
    const response = await axios.get(endpoints.dashboard, {
      params: {
        days,
      },
    });

    setData(response?.data?.data);
    setLoading(false);
  };



  

  const [selectedSeries, setSelectedSeries] = useState('Yearly');

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);

    let days = 7;

    if (newValue === 'Monthly') {
      days = 30;
    }

    if (newValue === 'Yearly') {
      days = 365;
    }

    getDashboard(days)

  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Hi, {user?.display_name} 👋
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}> It`s {fDateTime(time)}</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <DashWidgetSummary
            color="info"
            title="Total members"
            total={total_members}
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/users.svg`}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashWidgetSummary
            color="success"
            title="Total money in"
            is_currency
            total={total_money_in}
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/in.svg`}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <DashWidgetSummary
            color="error"
            title="Total money out"
            is_currency
            total={total_money_out}
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/out.svg`}
          />
        </Grid>

        <Grid xs={12} lg={9}>
          {(graph_data && !loading && (
            <TransactionsCount
              title="Transaction Performance"
              chart={{
                series: [
                  {
                    name: graph_data?.weekly?.period_name,
                    categories: graph_data?.weekly?.categories || [],
                    data: [{ data: graph_data?.weekly?.data || [] }],
                  },
                  {
                    name: graph_data?.monthly?.period_name,
                    categories: graph_data?.monthly?.categories || [],
                    data: [{ data: graph_data?.monthly?.data || [] }],
                  },
                  {
                    name: graph_data?.yearly?.period_name,
                    categories: graph_data?.yearly?.categories || [],
                    data: [{ data: graph_data?.yearly?.data || [] }],
                  },
                ],
              }}
              selectedSeries={selectedSeries}
              handleChangeSeries={handleChangeSeries}
            />
          )) || (
            <Stack spacing={2}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Stack>
          )}
        </Grid>

        <Grid xs={12} md={6} lg={3}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
            <DashWidgetSummary
              title="Total transactions"
              total={total_transactions}
              icon={`${CONFIG.assetsDir}/assets/icons/navbar/transactions.svg`}
            />
          </Box>
        </Grid>
        <Grid xs={12} md={12} lg={12}>
          <ApiRequests title="Transactions" />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'src/routes/hooks';
import Grid from '@mui/material/Unstable_Grid2';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import axios, { endpoints } from 'src/utils/axios';
import { DashWidgetSummary } from './app-dash-widget-summary';

// ----------------------------------------------------------------------

export function AppTellerDashboard() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    total_deposits: 0,
    total_withdrawals: 0,
    total_account_balance: 0,
    total_charge_amount: 0,
    currency: 'KES',
  });

  const getDashboard = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await axios.get(endpoints.tellerdashboard(id));
      const resData = response?.data?.data;

      if (resData) {
        setData({
          total_deposits: resData.total_deposits || 0,
          total_withdrawals: resData.total_withdrawals || 0,
          total_account_balance: resData.total_account_balance || 0,
          total_charge_amount: resData.total_charge_amount || 0,
          currency: resData.currency || 'KES',
        });
      }
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  const {
    total_deposits,
    total_withdrawals,
    total_account_balance,
    total_charge_amount,
  } = data;

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={3}>
          <DashWidgetSummary
            title="Total Deposits"
            total={total_deposits}
            is_currency
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/invoice.svg`}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary
            title="Total Withdrawals"
            total={total_withdrawals}
            is_currency
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/out.svg`}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary
            title="Account Balance"
            total={total_account_balance}
            is_currency
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/wallet.svg`}
          />
        </Grid>

        <Grid xs={12} md={3}>
          <DashWidgetSummary
            title="Total Charges"
            total={total_charge_amount}
            is_currency
            icon={`${CONFIG.assetsDir}/assets/icons/navbar/receipt.svg`}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

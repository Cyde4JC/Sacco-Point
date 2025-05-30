import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartSelect } from 'src/components/chart';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export function TransactionsCount({
  title,
  subheader,
  onChange,
  selectedSeries,
  handleChangeSeries,
  chart,
  ...other
}) {
  const theme = useTheme();

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const chartColors = chart.colors ?? [theme.palette.text.primary];

  const chartOptions = useChart({
    grid: { padding: { left: 24 } },
    stroke: { width: 3 },
    colors: chartColors,
    xaxis: { categories: currentSeries?.categories },
    tooltip: {
      y: { formatter: (value) => `${fNumber(value)} transactions`, title: { formatter: () => '' } },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <ChartSelect
            options={chart.series.map((item) => item.name)}
            value={selectedSeries}
            onChange={handleChangeSeries}
          />
        }
        sx={{ mb: 3 }}
      />

      <Chart
        type="line"
        series={currentSeries?.data}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}

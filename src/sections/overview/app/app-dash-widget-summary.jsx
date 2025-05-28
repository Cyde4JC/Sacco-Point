import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { fCurrency, fNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { SvgColor } from 'src/components/svg-color';
import { Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export function DashWidgetSummary({
  sx,
  is_currency = false,
  icon,
  title,
  total,
  color = 'warning',
  ...other
}) {
  return (
    <Card sx={{ py: 6, pl: 3, pr: 2.5, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ typography: 'h3' }}>
          {total === 0 ? <Skeleton width={100} /> : is_currency ? fCurrency(total) : fNumber(total)}
        </Box>
        <Typography noWrap variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>
      </Box>

      <SvgColor
        src={icon}
        sx={{
          top: 24,
          right: 20,
          width: 56,
          height: 56,
          position: 'absolute',
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars.palette[color].main} 0%, ${theme.vars.palette[color].dark} 100%)`,
        }}
      />

      <Box
        sx={{
          top: -44,
          width: 180,
          zIndex: -1,
          height: 200,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: (theme) =>
            `linear-gradient(to right, ${
              theme.vars.palette[color].main
            } 0%, ${varAlpha(theme.vars.palette[color].mainChannel, 0)} 100%)`,
        }}
      />
    </Card>
  );
}
